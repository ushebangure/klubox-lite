package transactions

import (
	"strconv"
	"time"

	"gopkg.in/mgo.v2/bson"

	"klubox/infrastructure/db"
	"klubox/util"
)

// Transaction is a struct representing a transaction
type Transaction struct {
	ID               db.ID     `json:"id"`
	AgentInID        db.ID     `json:"agentInId"`
	AgentOutID       db.ID     `json:"agentOutId"`
	Sender           Customer  `json:"sender"`
	Receiver         Customer  `json:"receiver"`
	ReferenceNumber  string    `json:"referenceNumber"`
	CollectionMethod string    `json:"collectionMethod"`
	CurrencyToPay    string    `json:"currencyTopay"`
	CurrencyToSend   string    `json:"currencyToSend"`
	AmountToSend     float64   `json:"amountToSend"`
	TotalToPay       float64   `json:"totalToPay"`
	ExchangeRate     float64   `json:"exchangeRate"`
	Charges          float64   `json:"charges"`
	PickUpLocation   Address   `json:"pickUpLocation"`
	Status           string    `json:"status"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

// Customer is a sender and receiver details struct
type Customer struct {
	IdNumber        string `json:"idNumber"`
	TransactionType string `json:"transactionType"`
	Gender          string `json:"gender"`
	Name            string `json:"name"`
	Surname         string `json:"surname"`
	Phone           string `json:"phone"`
}

// Address is a location details struct
type Address struct {
	Name        string `json:"name"`
	HouseNumber string `json:"houseNumber"`
	Street      string `json:"street"`
	City        string `json:"city"`
	State       string `json:"state"`
	Country     string `json:"country"`
	ZipCode     int    `json:"zipCode"`
}

// Validate Transaction
func (trans *Transaction) Validate() error {
	if trans.Sender.Name == "" {
		return util.ErrTransactionInvalidSender
	}
	if trans.Sender.surname == "" {
		return util.ErrTransactionInvalidSender
	}
	if trans.Sender.Phone == "" {
		return util.ErrTransactionInvalidSender
	}

	if trans.Receiver.Name == "" {
		return util.ErrTransactionInvalidReceiver
	}
	if trans.Receiver.Surname == "" {
		return util.ErrTransactionInvalidReceiver
	}
	if trans.Receiver.IdNumber == "" {
		return util.ErrTransactionInvalidReceiver
	}
	if trans.Reciever.Phone == "" {
		return util.ErrTransactionInvalidReceiver
	}

	if trans.CurrencyToPay == "" {
		return util.ErrTransactionInvalidCurrency
	}
	if trans.CurrencyToSend == "" {
		return util.ErrTransactionInvalidCurrency
	}

	if err := strconv.ParseFloat(trans.TotalToPay); err != nil {
		return util.ErrTransactionInvalidAmount
	}

	if err := strconv.ParseFloat(trans.AmountToSend); err != nil {
		return util.ErrTransactionInvalidAmount
	}
	if trans.AgentInID == "" {
		return util.ErrTransactionAgentIdMissing
	}
	if trans.AgentInID != "" {
		if bson.IsObjectIdHex(string(trans.AgentInID)) == false {
			return util.ErrTransactionAgentIdInvalid
		}
	}

	return nil
}

func validateID(id string) bool {
	return bson.IsObjectIdHex(id)
}
