package registry

import (
	"github.com/unrolled/render"

	"klubox/authenticator"
	"klubox/infrastructure/db"
	"klubox/users"
)

var formatter = render.New(render.Options{
	IndentJSON: true,
})

type Handlers struct {
	Auth  authenticator.AuthHandler
	Users users.UserHandler
}

// NewRegistry registered all the services and handler
func NewRegistry(db *db.MongoHandler) *Handlers {
	return &Handlers{
		Auth: authenticator.AuthHandler{
			AuthService: authenticator.AuthService{
				Repository: users.UserRepository{
					Db: db,
				},
			},
			Formatter: formatter,
		},
		Users: users.UserHandler{
			UserService: users.UserService{
				Repository: users.UserRepository{
					Db: db,
				},
			},
			Formatter: formatter,
		},
	}
}
