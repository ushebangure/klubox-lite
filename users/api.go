package users

import (
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	"github.com/unrolled/render"
	"net/http"

	"klubox/infrastructure/db"
	"klubox/util"
)

// UserHandler is a user handler struct
type UserHandler struct {
	UserService UserService
	Formatter   *render.Render
}

func (handler *UserHandler) CheckAppHealth(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	handler.Formatter.JSON(w, http.StatusOK, Health{true})
}

// Create handles incoming requests for creating a new user
func (handler *UserHandler) Create(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	payload := &User{}

	if err := json.NewDecoder(req.Body).Decode(payload); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("1001",
			"Invalid JSON payload supplied.", err.Error()))
		return
	}

	if err := payload.Validate(); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("1002",
			"Unable to validate the payload provided.", err.Error()))
		return
	}

	user, err := handler.UserService.CreateUser(payload)

	if err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("1003",
			"Unable to create a new user.", err.Error()))
		return
	}

	handler.Formatter.JSON(w, http.StatusCreated, user.hidePassword())
}

// GetUserByEmailOrByID handles the request for a single user either through the user id or email
func (handler *UserHandler) GetUserByEmailOrByIDH(w http.ResponseWriter, req *http.Request, params httprouter.Params) {
	emailOrID := params.ByName("emailOrID")

	if validateEmail(emailOrID) {

		user, err := handler.UserService.GetUserByEmail(emailOrID)

		if err != nil {
			handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("1005", "User not found. Invalid or unknown email", err.Error()))
		} else {
			handler.Formatter.JSON(w, http.StatusOK, user.hidePassword())
		}
	} else if validateID(emailOrID) {

		uid := db.ID(emailOrID)
		user, err := handler.UserService.GetUserByID(uid)

		if err != nil {
			handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("1006", "Could not get the requested user", err.Error()))
		} else {
			handler.Formatter.JSON(w, http.StatusOK, user.hidePassword())
		}
	} else {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("1007", "User not found.", "ID or Email format wrong. ID should be a bson hex string."))
	}
}

// GetAllUsers handles the request for all users
func (handler *UserHandler) GetAllUsers(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	var users []*User
	ul, err := handler.UserService.GetAllUsers()

	for _, user := range ul {
		users = append(users, user.hidePassword())
	}

	if err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("1008", "Missing user privileges", err.Error()))
	} else {
		handler.Formatter.JSON(w, http.StatusOK, users)
	}

}
