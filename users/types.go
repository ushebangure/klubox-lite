package users

import (
	"regexp"
	"time"

	"gopkg.in/mgo.v2/bson"

	"klubox/infrastructure/db"
	"klubox/util"
)

var (
	isValidEmail = regexp.MustCompile("^(((([a-zA-Z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])+(\\.([a-zA-Z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])|(\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-zA-Z]|\\d|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])|(([a-zA-Z]|\\d|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])([a-zA-Z]|\\d|-|\\.|_|~|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])*([a-zA-Z]|\\d|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])))\\.)+(([a-zA-Z]|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])|(([a-zA-Z]|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])([a-zA-Z]|\\d|-|_|~|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])*([a-zA-Z]|[\\x{00A0}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFEF}])))\\.?$")
)

// User is a struct representing a create user request payload
type User struct {
	ID        db.ID     `json:"id"`
	Name      string    `json:"name"`
	Surname   string    `json:"surname"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"password,omitempty"`
	Role      []string  `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Health struct {
	Status bool `json:"healthy"`
}

// Validate validates the payload
func (user *User) Validate() error {
	if user.Name == "" {
		return util.ErrNameMissing
	}

	if user.Surname == "" {
		return util.ErrSurnameMissing
	}

	if user.Email == "" || !isValidEmail.MatchString(user.Email) {
		return util.ErrEmailMissing
	}

	if user.Password == "" {
		return util.ErrPasswordMissing
	}

	if user.Role != "" && !util.IsValidRole(user.Role) {
		return util.ErrInvalidRole
	}

	return nil
}

func (user *User) hidePassword() *User {
	user.Password = ""
	return user
}

//validateEmail validates the email sent as a parameter
func validateEmail(email string) bool {
	return isValidEmail.Match([]byte(email))
}

//validateID validates the id sent
func validateID(id string) bool {
	return bson.IsObjectIdHex(id)
}
