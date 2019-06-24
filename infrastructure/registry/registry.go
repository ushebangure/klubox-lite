package registry

import (
	"github.com/unrolled/render"

	"klubox/authenticator"
	"klubox/infrastructure/db"
	"klubox/users"
	"klubox/locations"
	"klubox/currencies"
	"klubox/transactions"
)

var formatter = render.New(render.Options{
	IndentJSON: true,
})

type Handlers struct {
	Auth  authenticator.AuthHandler
	Users users.UserHandler
	Currencies currencies.CurrencyHandler
	Locations locations.LocationHandler
	Transactions transactions.TransactionHandler
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
		Locations: locations.LocationHandler{
			LocationService: locations.LocationService{
				Repository: locations.LocationRepository{
					Db: db,
				},
			},
			Formatter: formatter,
		},
		Currencies: currencies.CurrencyHandler{
			CurrencyService: currencies.CurrencyService{
				Repository: currencies.CurrencyRepository{
					Db: db,
				},
			},
			Formatter: formatter,
		},
		Transactions: transactions.TransactionHandler{
			TransactionService: transaction.TransactionService{
				Repository: transactions.TransactionRepository{
					Db: db,
				},
			},
			Formatter: formatter,
		}
	}
}
