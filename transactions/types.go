package transactions

import (
	"time"

	"klubox/infrastructure/db"
)

// TransactionDetails is a struct representing a transaction
type TransactionDetails struct {
	ID               db.ID     `json:"id"`
	Sender           Customer  `json:"sender"`
	Receiver         Customer  `json:"receiver"`
	ReferenceNumber  string    `json:"referenceNumber"`
	CollectionMethod string    `json:"collectionMethod"`
	Currency         string    `json:"currency"`
	ReceiveAmount    int64     `json:"receiveAmount"`
	TotalToPay       int64     `json:"totalToPay"`
	ExchangeRate     int64     `json:"exchangeRate"`
	Charges          int64     `json:"charges"`
	PickUpLocation   Address   `json:"pickUpLocation"`
	Status           string    `json:"status"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

// Customer is a sender and receiver details struct
type Customer struct {
	ID              db.ID  `json:"id"`
	IdNumber        string `json:"idNumber"`
	TransactionType string `json:"transactionType"`
	Gender          string `json:"gender"`
	Name            string `json:"name"`
	Surname         string `json:"surname"`
	Phone           string `json:"phone"`
}

// Address is a location details struct
type Address struct {
	HouseNumber string `json:"houseNumber"`
	Street      string `json:"street"`
	City        string `json:"city"`
	State       string `json:"state"`
	Country     string `json:"country"`
	ZipCode     int    `json:"zipCode"`
}
