package util

import (
	"klubox/configs"
	"log"
	"time"

	"github.com/juju/mgosession"
	"gopkg.in/mgo.v2"
)

// MongoHandler is a mongo db handler
type MongoHandler struct {
	*mgosession.Pool
}

// Query is a method for querying data
func (handler *MongoHandler) Query(name string) *mgo.Collection {
	session := handler.Session(nil)

	return session.DB(configs.MONGODB_DATABASE).C(name)
}

// Close closes a db connection
func (handler *MongoHandler) Close() {
	handler.Close()
}

// NewMongoHandler initialises the Mongo DB
func NewMongoHandler() (*MongoHandler, error) {
	dialInfo := &mgo.DialInfo{
		Addrs:    []string{configs.MONGODB_HOSTS},
		Timeout:  60 * time.Second,
		Database: configs.MONGODB_DATABASE,
		Username: configs.MONGODB_USERNAME,
		Password: configs.MONGODB_PASSWORD,
	}

	log.Printf("INFO: Initialising Mongo DB connection ......")

	session, err := mgo.DialWithInfo(dialInfo)

	if err != nil {
		log.Fatalf("ERROR: Failed to dial up the database host: %v\n", err)
		return nil, err
	}

	log.Printf("INFO: Mongo DB successfully connected !! \n")

	defer session.Close()

	mPool := mgosession.NewPool(nil, session, configs.MONGODB_CONNECTION_POOL)

	return &MongoHandler{mPool}, nil
}

