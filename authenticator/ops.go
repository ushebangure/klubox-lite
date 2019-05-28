package authenticator

import (
	"klubox/configs"
	"klubox/util"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"

	"klubox/users"
)

// LoginService is a default rest service implementation of the login service
type AuthService struct {
	Repository users.UserRepository
}

// CheckCredentials checks the provided user credentials before logging in a user
func (service *AuthService) CheckCredentials(credentials *Credentials) (string, error) {
	user, err := service.Repository.FindByEmail(credentials.Email)

	if err != nil {
		return "", err
	}

	if credentials.Email != user.Email {
		return "", util.ErrMismatchingEmails
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password)); err != nil {
		return "", util.ErrInvalidPassword
	}

	var signingKey = []byte(configs.JWT_SECRET)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"uid": user.ID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
		"iup": []string{user.Role},
	})

	tokenString, err := token.SignedString(signingKey)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}
