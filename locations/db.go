package locations

import (
	"gopkg.in/mgo.v2/bson"

	"klubox/infrastructure/db"
	"klubox/util"
)

// LocationRepository is a mongo implementation of the location repository
type LocationRepository struct {
	Db db.DbHandler
}

// Save is the method for saving a location in the database
func (repo *LocationRepository) Save(location *Location) (*Location, error) {
	collection := repo.Db.Query("locations")
	query := bson.M{"name": location.Name}

	count, err := collection.Find(query).Count()

	if err != nill {
		return nil, err
	} else if count > 0 {
		return nil, util.ErrLocationExists
	}

	location.ID = db.NewID()

	if err1 := collection.Insert(location); err1 != nil {
		return nil, err1
	}

	return location, nil
}

// FindAll - method for getting all the location
func (repo *LocationRepository) FindAll() ([]*Location, error) {
	var locations []*Location
	collection := repo.Db.Query("locations")

	err := collection.FindAll(bson.M{}).All(&locations)

	if err != nil {
		return nil, err
	}

	return locations, nil
}

// DeleteLocation - method for deleting location
func (repo *LocationRepository) DeleteLocation(id string) error {
	collection := repo.Db.Query("locations")

	query := bson.M{"id", bson.ObjectIdHex(id)}

	count, err := collection.Find(query).Count()

	if err != nil {
		return err
	}

	if count < 1 {
		return util.ErrLocationDoesNotExist
	}

	err := collection.Remove(query)

	if err != nil {
		return err
	}

	return nil
}
