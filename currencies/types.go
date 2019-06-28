package currencies

import (
	"gopkg.in/mgo.v2/bson"

	"klubox/infrastructure/db"
	"klubox/util"
)

type Currency struct {
	ID        db.ID   `json:"id"`
	Name      string  `json:"name"`
	RateToUsd float32 `json:"rateToUsd"`
}

// Validate the currency
func (curr *Currency) Validate() error {
	if curr.Name == "" {
		return util.ErrCurrencyNameMissing
	}
	if curr.RateToUsd < 0 || curr.RateToUsd == "" {
		return util.ErrCurrencyValueFalsy
	}
	return nil
}

// Validate the id
func validateID(id string) bool {
	return bson.IsObjectIdHex(id)
}
