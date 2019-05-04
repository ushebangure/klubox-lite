package util

import mgo "gopkg.in/mgo.v2"

// DbHandler is an interface definition for database handlers
type DbHandler interface {
	Query(name string) *mgo.Collection
	Close()
}
