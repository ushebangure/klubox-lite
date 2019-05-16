package authenticator

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"

	"klubox/util"
)

var (
	TokenCtxKey = &contextKey{"Token"}

	ErrorCtxKey = &contextKey{"Error"}
)

// JWTAuth struct
type JWTAuth struct {
	signKey   interface{}
	verifyKey interface{}
	signer    jwt.SigningMethod
	parser    *jwt.Parser
}

// New creates a JWTAuth authenticator instance that provides middleware handlers
// and encoding/decoding functions for JWT signing.
func New(alg string, signKey interface{}, verifyKey interface{}) *JWTAuth {
	return NewWithParser(alg, &jwt.Parser{}, signKey, verifyKey)
}

// NewWithParser is the same as New, except it supports custom parser settings
// introduced in jwt-go/v2.4.0.
//
// We explicitly toggle `SkipClaimsValidation` in the `jwt-go` parser so that
// we can control when the claims are validated - in our case, by the Verifier
// http middleware handler.
func NewWithParser(alg string, parser *jwt.Parser, signKey interface{}, verifyKey interface{}) *JWTAuth {
	parser.SkipClaimsValidation = true
	return &JWTAuth{
		signKey:   signKey,
		verifyKey: verifyKey,
		signer:    jwt.GetSigningMethod(alg),
		parser:    parser,
	}
}

// Verifier http middleware handler will verify a JWT string from a http request.
//
// Verifier will search for a JWT token in a http request, in the order:
//   1. 'jwt' URI query parameter
//   2. 'Authorization: BEARER T' request header
//   3. Cookie 'jwt' value
//
// The first JWT string that is found as a query parameter, authorization header
// or cookie header is then decoded by the `jwt-go` library and a *jwt.Token
// object is set on the request context. In the case of a signature decoding error
// the Verifier will also set the error on the request context.
//
// The Verifier always calls the next http handler in sequence, which can either
// be the generic `jwtauth.Authenticator` middleware or your own custom handler
// which checks the request context jwt token and error to prepare a custom
// http response.
func verifier(ja *JWTAuth) func(next httprouter.Handle) httprouter.Handle {
	return func(next httprouter.Handle) httprouter.Handle {
		return Verify(ja, TokenFromQuery, TokenFromHeader, TokenFromCookie)(next)
	}
}

// Auth klubox-lite custom implementation
func Auth() func(next httprouter.Handle) httprouter.Handle {
	var ja = New("HS256", []byte("secret"), nil)
	return verifier(ja)
}

// Verify method
func Verify(ja *JWTAuth, findTokenFns ...func(r *http.Request) string) func(next httprouter.Handle) httprouter.Handle {
	return func(next httprouter.Handle) httprouter.Handle {
		hfn := func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
			ctx := r.Context()
			token, err := VerifyRequest(ja, r, findTokenFns...)
			ctx = NewContext(ctx, token, err)
			next(w, r.WithContext(ctx), ps)
		}
		return hfn
	}
}

// VerifyRequest method
func VerifyRequest(ja *JWTAuth, r *http.Request, findTokenFns ...func(r *http.Request) string) (*jwt.Token, error) {
	var tokenStr string
	var err error

	// Extract token string from the request by calling token find functions in
	// the order they where provided. Further extraction stops if a function
	// returns a non-empty string.
	for _, fn := range findTokenFns {
		tokenStr = fn(r)
		if tokenStr != "" {
			break
		}
	}
	if tokenStr == "" {
		return nil, util.ErrNoTokenFound
	}

	// TODO: what other kinds of validations should we do / error messages?

	// Verify the token
	token, err := ja.Decode(tokenStr)
	if err != nil {
		switch err.Error() {
		case "token is expired":
			err = util.ErrExpired
		}
		return token, err
	}

	if token == nil || !token.Valid || token.Method != ja.signer {
		err = util.ErrUnauthorized
		return token, err
	}

	// Check expiry via "exp" claim
	if IsExpired(token) {
		err = util.ErrExpired
		return token, err
	}

	// Valid!
	return token, nil
}

// Encode method
func (ja *JWTAuth) Encode(claims Claims) (t *jwt.Token, tokenString string, err error) {
	t = jwt.New(ja.signer)
	t.Claims = claims
	tokenString, err = t.SignedString(ja.signKey)
	t.Raw = tokenString
	return
}

// Decode method
func (ja *JWTAuth) Decode(tokenString string) (t *jwt.Token, err error) {
	// Decode the tokenString, but avoid using custom Claims via jwt-go's
	// ParseWithClaims as the jwt-go types will cause some glitches, so easier
	// to decode as MapClaims then wrap the underlying map[string]interface{}
	// to our Claims type
	t, err = ja.parser.Parse(tokenString, ja.keyFunc)
	if err != nil {
		return nil, err
	}
	return
}

func (ja *JWTAuth) keyFunc(t *jwt.Token) (interface{}, error) {
	if ja.verifyKey != nil {
		return ja.verifyKey, nil
	}
	return ja.signKey, nil

}

// NewContext method
func NewContext(ctx context.Context, t *jwt.Token, err error) context.Context {
	ctx = context.WithValue(ctx, TokenCtxKey, t)
	ctx = context.WithValue(ctx, ErrorCtxKey, err)
	return ctx
}

// FromContext method
func FromContext(ctx context.Context) (*jwt.Token, Claims, error) {
	token, _ := ctx.Value(TokenCtxKey).(*jwt.Token)

	var claims Claims
	if token != nil {
		switch tokenClaims := token.Claims.(type) {
		case Claims:
			claims = tokenClaims
		case jwt.MapClaims:
			claims = Claims(tokenClaims)
		default:
			panic(fmt.Sprintf("jwtauth: unknown type of Claims: %T", token.Claims))
		}
	} else {
		claims = Claims{}
	}

	err, _ := ctx.Value(ErrorCtxKey).(error)

	return token, claims, err
}

// IsExpired method
func IsExpired(t *jwt.Token) bool {
	claims, ok := t.Claims.(jwt.MapClaims)
	if !ok {
		panic("jwtauth: expecting jwt.MapClaims")
	}

	if expv, ok := claims["exp"]; ok {
		var exp int64
		switch v := expv.(type) {
		case float64:
			exp = int64(v)
		case int64:
			exp = v
		case json.Number:
			exp, _ = v.Int64()
		default:
		}

		if exp < EpochNow() {
			return true
		}
	}

	return false
}

// Claims is a convenience type to manage a JWT claims hash.
type Claims map[string]interface{}

// Valid - note: as of v3.0 of jwt-go, Valid() interface method is called to verify
// the claims. However, the current design we test these claims in the
// Verifier middleware, so we skip this step.
func (c Claims) Valid() error {
	return nil
}

// Set method
func (c Claims) Set(k string, v interface{}) Claims {
	c[k] = v
	return c
}

// Get method
func (c Claims) Get(k string) (interface{}, bool) {
	v, ok := c[k]
	return v, ok
}

// SetIssuedAt issued at ("iat") to specified time in the claims
func (c Claims) SetIssuedAt(tm time.Time) Claims {
	c["iat"] = tm.UTC().Unix()
	return c
}

// SetIssuedNow ("iat") to present time in the claims
func (c Claims) SetIssuedNow() Claims {
	c["iat"] = EpochNow()
	return c
}

// SetExpiry in the claims and return itself so it can be chained
func (c Claims) SetExpiry(tm time.Time) Claims {
	c["exp"] = tm.UTC().Unix()
	return c
}

// SetExpiryIn in the claims to some duration from the present time
// and return itself so it can be chained
func (c Claims) SetExpiryIn(tm time.Duration) Claims {
	c["exp"] = ExpireIn(tm)
	return c
}

// EpochNow function that returns the NumericDate time value used by the spec
func EpochNow() int64 {
	return time.Now().UTC().Unix()
}

// ExpireIn function to return calculated time in the future for "exp" claim.
func ExpireIn(tm time.Duration) int64 {
	return EpochNow() + int64(tm.Seconds())
}

// TokenFromCookie tries to retreive the token string from a cookie named
// "jwt".
func TokenFromCookie(r *http.Request) string {
	cookie, err := r.Cookie("jwt")
	if err != nil {
		return ""
	}
	return cookie.Value
}

// TokenFromHeader tries to retreive the token string from the
// "Authorization" reqeust header: "Authorization: BEARER T".
func TokenFromHeader(r *http.Request) string {
	// Get token from authorization header.
	bearer := r.Header.Get("Authorization")
	if len(bearer) > 7 && strings.ToUpper(bearer[0:6]) == "BEARER" {
		return bearer[7:]
	}
	return ""
}

// TokenFromQuery tries to retreive the token string from the "jwt" URI
// query parameter.
func TokenFromQuery(r *http.Request) string {
	// Get token from query param named "jwt".
	return r.URL.Query().Get("jwt")
}

// contextKey is a value for use with context.WithValue. It's used as
// a pointer so it fits in an interface{} without allocation. This technique
// for defining context keys was copied from Go 1.7's new use of context in net/http.
type contextKey struct {
	name string
}

func (k *contextKey) String() string {
	return "jwtauth context value " + k.name
}
