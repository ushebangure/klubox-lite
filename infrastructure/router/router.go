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
	Protected   bool
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
			Protected:   true,
		},
		{
			Name:        "Get list of users",
			Method:      "GET",
			Path:        "/users",
			HandlerFunc: authenticator.IsAdmin(handlers.Users.GetAllUsers),
			Protected:   true,
		},
		{
			Name:        "Create user",
			Method:      "POST",
			Path:        "/users",
			HandlerFunc: authenticator.IsAdmin(handlers.Users.Create),
			Protected:   true,
		},
	}
}

// NewRouter reads from the routes slice to translate to httprouter.Handle
func NewRouter(routes Routes) *httprouter.Router {
	router := httprouter.New()

	for _, route := range routes {
		stack := mid.NewStack()
		stack.Use(middleware.Logger)
		stack.Use(middleware.Cors)

		if route.Protected {
			stack.Use(authenticator.Auth())
			stack.Use(authenticator.Authenticate)
		}

		router.Handle(route.Method, route.Path, stack.Wrap(route.HandlerFunc))
	}

	return router
}
