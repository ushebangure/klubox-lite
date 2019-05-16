package middleware
//
//import (
//	"net/http"
//
//	"github.com/julienschmidt/httprouter"
//)
//
//// Middleware is a struct that defines middleware.
//type Middleware struct {
//	Options Options
//}
//
//// Operation is a middleware operation.
//type Operation func(w http.ResponseWriter, r *http.Request, params httprouter.Params) bool
//
//// New creates a new Middleware.
//func New(options Options) *Middleware {
//	return &Middleware{
//		Options: options,
//	}
//}
//
//// Add adds middleware operations to a Handler.
//func (m *Middleware) Add(next httprouter.Handle, operations ...Operation) httprouter.Handle {
//	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
//		for _, operation := range operations {
//			if !operation(w, r, params) {
//				return
//			}
//		}
//
//		next(w, r, params)
//	}
//}
