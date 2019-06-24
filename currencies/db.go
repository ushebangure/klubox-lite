package currencies

import (
  "gopkg.in/mgo.v2/bson"

  "klubox/infrastructure/db"
	"klubox/util"
)

// CurrencyRepository is a Mongo DB implementation of the currency repository
type CurrencyRepository struct {
  Db db.DbHandler
}

// Save is a method for adding a currency to the currency mongo repo.
func (repo *CurrencyRepository) Save(curr *Currency) (*Currency, error) {
  collection := repo.Db.Query("currencies")

  query := bson.M{"name": curr.Name}
  count, err := collection.Find(query).Count()

  if err != nill {
    return nil, err
  } else if count > 0 {
    return nil, util.ErrCurrencyExists
  }

  curr.ID = db.NewID()

  if err1 := collection.Insert(curr); err != nil {
    return nil, err
  }

  return curr, nil
}

// FindAll - method for retrieving currencies
func (repo *CurrencyRepository) FindAll () ([]*Currency, error) {
  var currencies []*Currency

  collection := repo.Db.Query("currencies")

  err := collection.Find(bson.M{}).All(&currencies)

  if err != nil {
    return nil, util.ErrDBError
  }

  return currencies, nil
}

// DeleteCurrency - method for deleting currency
func (repo *CurrencyRepository) DeleteCurrency (id string) error {
  collection := repo.Db.Query("currencies")
  query := bson.M{"id", bson.ObjectIdHex(id)}

  count, err := collection.Find(query).Count()

  if err != nil {
    return err
  }

  if count < 1 {
    return util.ErrCurrencyDoesNotExist
  }

  err = collection.Remove(query)

  if err != nil {
    return err
  }

  return nil
}

// UpdateCurrency - updates the exchange rate of a currency
func (repo *CurrencyRepository) UpdateCurrency (id string, curr *Currency) (*Currency, error) {
  collection := repo.Db.Query("currencies")
  id = bson.ObjectIdHex(id)

  err := collection.Update(bson.M{"id": id}, curr))

  if err != nil {
    return nil, err
  }

  return curr , nil
}
