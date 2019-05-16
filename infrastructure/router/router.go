package router

import (
	"github.com/julienschmidt/httprouter"
	mid "github.com/rileyr/middleware"

	"klubox/authenticator"
	"klubox/infrastructure/middleware"
	"klubox/infrastructure/registry"
)

/*
Define all the routes here.
A new Route entry passed to the routes slice will be automatically
translated to a handler with the NewRouter() function
*/
type Route struct {
	Name        string
	Method      string
	Path        string
	HandlerFunc httprouter.Handle
	Role        string
}

type Routes []Route

func RegisterServiceRoutes(handlers *registry.Handlers) Routes {
	return Routes{
		{
			Name:        "Health",
			Method:      "GET",
			Path:        "/health",
			HandlerFunc: handlers.Users.CheckAppHealth,
		},
		{
			Name:        "Login user",
			Method:      "POST",
			Path:        "/auth/jwt",
			HandlerFunc: handlers.Auth.Login,
		},
		{
			Name:        "Get single user",
			Method:      "GET",
			Path:        "/users/:emailOrID",
			HandlerFunc: handlers.Users.GetUserByEmailOrByIDH,
		},
		{
			Name:        "Get list of users",
			Method:      "GET",
			Path:        "/users",
			HandlerFunc: handlers.Users.GetAllUsers,
			Role:        "admin",
		},
		{
			Name:        "Create user",
			Method:      "POST",
			Path:        "/users",
			HandlerFunc: handlers.Users.Create,
		},
	}
}

// NewRouter reads from the routes slice to translate to httprouter.Handle
func NewRouter(routes Routes) *httprouter.Router {
	router := httprouter.New()

	for _, route := range routes {
		stack := mid.NewStack()
		stack.Use(middleware.Logger)

		if route.Role != "" {
			stack.Use(authenticator.Auth())
			stack.Use(authenticator.Authenticate)

			// TODO(ubangure): Add switch case to handle more routes.
			stack.Use(authenticator.Authorize)
		}

		router.Handle(route.Method, route.Path, stack.Wrap(route.HandlerFunc))
	}

	return router
}
