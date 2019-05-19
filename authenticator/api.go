package authenticator

import (
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	"github.com/unrolled/render"
	"klubox/util"
	"net/http"
)

// AuthService is a login handler struct
type AuthHandler struct {
	AuthService AuthService
	Formatter    *render.Render
}

var formatter = render.New(render.Options{
	IndentJSON: true,
})

// Authenticate is a authentication middleware
func Authenticate(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		token, _, err := FromContext(r.Context())

		if err != nil {
			formatter.JSON(w, http.StatusUnauthorized, util.NewError("2001",
				" Unuthothorised API request.", err.Error()))
			return
		}

		if token == nil || !token.Valid {
			formatter.JSON(w, http.StatusUnauthorized, util.NewError("2002",
				"Unuthothorised API request.", err.Error()))
			return
		}

		next(w, r, ps)
	}
}

func authorize(permissions []string, w http.ResponseWriter, r *http.Request) bool {
	token, _, _ := FromContext(r.Context())

	claims := NewClaims(token)
	if !claims.HasPermissions(permissions, false) {
		formatter.JSON(w, http.StatusUnauthorized, util.NewError("2001",
			" Unuthothorised API request.", util.ErrNoPermissions.Error()))
		return false
	}

	return true
}

func IsAdmin(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		if !authorize(util.Admin(), w, r) {
			return
		}

		next(w, r, ps)
	}
}

func IsAgent(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		if !authorize(util.Agent(), w, r) {
			return
		}

		next(w, r, ps)
	}
}

func IsPayout(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		if !authorize(util.Payout(), w, r) {
			return
		}

		next(w, r, ps)
	}
}

// Login receives a login payload and passes the request to the login service
func (handler *AuthHandler) Login(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	payload := &Credentials{}

	if err := json.NewDecoder(req.Body).Decode(payload); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("1001", "Invalid JSON payload supplied.", err.Error()))
		return
	}

	if err := payload.Validate(); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("1002", "Unable to validate the payload provided.", err.Error()))
		return
	}

	jwtToken, err := handler.AuthService.CheckCredentials(payload)

	if err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("1003", "Unable to login user.", err.Error()))
		return
	}

	handler.Formatter.JSON(w, http.StatusCreated, LoginResponse{jwtToken})
}

