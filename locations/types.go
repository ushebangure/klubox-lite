package locations

import (
  "gopkg.in/mgo.v2/bson"

  "klubox/infrastructure/db"
  "klubox/util"
)

type Location struct {
  ID     db.ID  `json:"id"`
  Name   string `json:"name"`
}

// Validate the location
func (curr *Location) Validate() error {
  if (curr.Name == "") {
    return util.ErrLocationNameMissing
  }
  return nil
}

// Validate the id
func validateID(id string) bool {
  return bson.IsObjectIdHex(id)
}
