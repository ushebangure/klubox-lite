package users

import (
	"time"

	"gopkg.in/mgo.v2/bson"

	"klubox/util"
)

// UserRepositoryMgo is a Mongo DB implementation of the user repository
type UserRepository struct {
	Db util.DbHandler
}

// Save is a user repository method that creates a new user. Mongo Implementation of the user_repository interface.
func (repository *UserRepository) Save(user *User) (*User, error) {
	collection := repository.Db.Query("users")
	//defer repository.Db.Close()

	query := bson.M{"email": user.Email}
	count, err := collection.Find(query).Count()

	if err != nil {
		return nil, util.ErrUserDBGeneral
	} else if count > 0 {
		return nil, util.ErrUserEmailExist
	}

	user.ID = util.NewID()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	if err := collection.Insert(user); err != nil {
		return nil, util.ErrUserNotCreated
	}

	return user, nil
}

//FindByID - finds a user using the user's id
func (repository *UserRepository) FindByID(id util.ID) (*User, error) {
	var userBuffer User

	idHex := string(id)

	collection := repository.Db.Query("users")
	err := collection.Find(bson.M{"id": bson.ObjectIdHex(idHex)}).One(&userBuffer)

	if err != nil {
		return nil, util.ErrUserNotFound
	}

	return &userBuffer, nil
}

//FindByEmail -a user using the user's email
func (repository *UserRepository) FindByEmail(email string) (*User, error) {
	var userBuffer User
	collection := repository.Db.Query("users")
	err := collection.Find(bson.M{"email": email}).One(&userBuffer)

	if err != nil {
		return nil, util.ErrUserNotFound
	}

	return &userBuffer, nil
}

//FindAll - finds all the users
func (repository *UserRepository) FindAll() ([]*User, error) {
	var usersBuffer []*User

	collection := repository.Db.Query("users")

	err := collection.Find(bson.M{}).

		All(&usersBuffer)

	if err != nil {
		return nil, util.ErrNoUsersFound
	}

	return usersBuffer, nil
}
