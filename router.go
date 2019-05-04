package main

import (
	"github.com/julienschmidt/httprouter"
	"github.com/unrolled/render"

	"klubox/users"
)

var formatter = render.New(render.Options{
	IndentJSON: true,
})

func RegisterServiceRoutes() *httprouter.Router {
	userService, err := users.NewUserService()
	if err != nil {
		return nil
	}

	userHandler := users.UserHandler{
		UserService: userService,
		Formatter:   formatter,
	}

	/*-------------------------------------*
	 * Setup all the configured routes     *
	 * ------------------------------------*/
	r := httprouter.New()

	r.GET("/health", userHandler.CheckAppHealth)
	r.POST("/users", userHandler.Create)
	r.GET("/users", userHandler.GetAllUsers)
	r.GET("/users/:emailOrID", userHandler.GetUserByEmailOrByIDH)

	return r
}
