package authenticator

import (
	"github.com/julienschmidt/httprouter"
	"github.com/unrolled/render"
	"klubox/util"
	"net/http"
)

// Authenticate is a authentication middleware to enforce access from the
// Auth middleware request context values.
func Authorize(next httprouter.Handle) httprouter.Handle {

	var formatter = render.New(render.Options{
		IndentJSON: true,
	})

	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		token, _, _ := FromContext(r.Context())

		// check permissions
		claims := NewClaims(token)

		// Load route permissions
		if !claims.HasPermission("admin") {
			formatter.JSON(w, http.StatusUnauthorized, util.NewError("2001",
				" Unuthothorised API request.", util.ErrNoPermissions.Error()))
			return
		}

		// Token is authenticated, pass it through
		next(w, r, ps)
	}
}
