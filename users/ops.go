package users

import (
	"golang.org/x/crypto/bcrypt"

	"klubox/infrastructure/db"
	"klubox/util"
)

// UserService is a default implementation of the user service.
type UserService struct {
	Repository UserRepository
}

// CreateUser is a user service method that returns a unique user by user ID.
func (service *UserService) CreateUser(user *User) (*User, error) {
	if bytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost); err == nil {
		user.Password = string(bytes)
	} else {
		return nil, util.ErrPasswordEncryption
	}

	return service.Repository.Save(user)
}

//GetUserByEmail is a user service method for retrieving a user from the db.
func (service *UserService) GetUserByEmail(email string) (*User, error) {
	return service.Repository.FindByEmail(email)
}

//GetUserByID is a user service method for retrieving a user from the db.
func (service *UserService) GetUserByID(id db.ID) (*User, error) {
	return service.Repository.FindByID(id)
}

//GetAllUsers is a user service method for getting all the users in the database
func (service *UserService) GetAllUsers() ([]*User, error) {
	return service.Repository.FindAll()
}
