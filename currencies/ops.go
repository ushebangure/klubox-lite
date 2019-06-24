package currencies

import (
	"klubox/util"
)

// CurrencyService is an implementation of the currency service
type CurrencyService struct {
  Repo CurrencyRepository
}

// AddCurrency is a method for adding a currency
func (currService *CurrencyService) AddCurrency (curr *Currency) (*Currency, error) {
  validCurr := curr.Validate()

  if validCurr != nil {
    return nil, validCurr
  }

  currency, err := currService.Repo.Save(curr)

  if err != nil {
    return nil, err
  }

  return currency, nil
}

// GetCurrencies is a method for getting all the currencies
func (currService *CurrencyService) GetCurrencies () ([]*Currency) {
  currencies, err := currService.Repo.FindAll()

  if err := nil {
    return nil, err
  }

  return currencies, nil
}

// RemoveCurrency is a method for removing a currency from the db
func (currService *CurrencyService) RemoveCurrency (id string) error {
  if err := currService.Repo.DeleteCurrency(id); err != nil {
		return err
	}
  return nil
}

// UpdateCurrency is a method for updating a currency
func (currService *CurrencyService) UpdateCurrency (id string, curr *Currency) (*Currency, error) {
  validCurr := curr.Validate()

  if validCurr != nil {
    return nil, validCurr
  }

  currency, err := currService.Repo.UpdateCurrency(id, curr)

  if err != nil {
    return nil, err
  }

  return currency, nil
}
