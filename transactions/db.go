package transactions

import (
	"fmt"
	"time"

	"gopkg.in/mgo.v2/bson"

	"klubox/infrastructure/db"
	"klubox/util"
)

// TransactionRepository is a mongo db implementation of the transaction repository
type TransactionRepository struct {
	Db db.DbHandler
}

// Save is a method for saving a transaction in the repo
func (repo *TransactionRepository) Save(trans *Transaction) (*Transaction, error) {
<<<<<<< HEAD
	if err := trans.Validate(); err != nil {
		return err
=======
	// TODO(brad): Use err, don't number the err1, err2 e.t.c
	if err1 := trans.Validate(); err1 != nil {
		return err1
>>>>>>> 55044d2f43bbe7bfae778a534f931a3ed154a2fb
	}

	collection := repo.Db.Query("transactions")
	query := bson.M{"referenceNumber": trans.ReferenceNumber}

	trans.ID = db.NewID()
	trans.Status = "Pending"
	trans.CreatedAt = time.Now()
	trans.UpdatedAt = time.Now()

	count, err := collection.Find(query).Count();

	if err != nil {
		return nil, err
	}

	if count > 0 {
		return nil, util.ErrTransactionRefExists
	}

	if err := collection.Insert(trans); err != nil {
		return nil, err
	}

	return trans, nil
}

// FindAll is a method for getting all the transactions
func (repo *TransactionRepository) FindAll() ([]*Transaction, error) {
	collection := repo.Db.Query("transactions")
	var transactions []*Transaction

	if err := collection.Find(bson.M{}).All(&transactions); err != nil {
		return nil, err
	}

	return transactions, nil
}

// FindByFilters - method for getting transactions using filters - dateRange and filter
func (repo *TransactionRepository) FindByFilters(filter string, dateTo *time.Time, dateFrom *time.Time) ([]*Transaction, error) {
	collection := repo.Db.Query("transactions")
	// TODO(brad): Define this once and add to the list as you collect. Look into using variadic options looks something like this, ( ...) or just append the list
	var transactions []*Transaction
	var buffer []*Transaction
	var buffer []*Transaction
	var buffer []*Transaction
	var buffer []*Transaction

	// TODO(brad): Fail fast, check for if filter == "" { return early } then continue with the below
	if filter != "" {
		query := bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "sender.Name": {"$regex": filter}}

		if err := collection.Find(query).All(&buffer); err != nil {
			return nil, err
		}

<<<<<<< HEAD
		query = bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "sender.Surname": {"$regex": filter}}
=======
		// TODO(brad): Don't increment again, reuse query
		query1 := bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "sender.Surname": {"$regex": filter}}
>>>>>>> 55044d2f43bbe7bfae778a534f931a3ed154a2fb

		if err := collection.Find(query).All(&buffer); err != nil {
			return nil, err
		}

		transactions = append(transactions, buffer...)

		query = bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "receiver.Name": {"$regex": filter}}

		if err := collection.Find(query).All(&buffer); err != nil {
			return nil, err
		}

		transactions = append(transactions, buffer...)

		query = bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "receiver.Surname": {"$regex": filter}}

		if err := collection.Find(query).All(&buffer); err != nil {
			return nil, err
		}

		transactions = append(transactions, buffer...)

		query = bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "referenceNumber": {"$regex": filter}}

		if err := collection.Find(query).All(&buffer); err != nil {
			return nil, err
		}

<<<<<<< HEAD
		transactions = append(transactions, buffer...)
=======
		// TODO(brad): lol, I see you used a variadic here, tie this in with my comment above
		transactions = append(transactions, transactions4...)
>>>>>>> 55044d2f43bbe7bfae778a534f931a3ed154a2fb
	} else {
		query := bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}}

		if err := collection.Find(query).All(&transactions); err != nil {
			return nil, err
		}
	}

	return transactions, nil
}

// UpdateTransaction is the method for updating the transaction when payout occurs
func (repo *TransactionRepository) UpdateTransaction(id string, agentId string) error {
	collection := repo.Db.Query("transactions")
	var trans *Transaction

	if bson.IsObjectIdHex(id) {
		id = bson.ObjectIdHex(id)
		if err := collection.Find(bson.M{"id": id}).One(&trans); err != nil {
			return err
		}

		if trans.Status == "Completed" {
			return error.New(fmt.Sprintf("Transaction payout was done on %d", trans.UpdatedAt))
		}

		if bson.IsObjectIdHex(agentId) != true {
			return util.ErrTransactionAgentIdInvalid
		}

		trans.AgentOutID = bson.ObjectIdHex(agentId)
		trans.UpdatedAt = time.Now()
		trans.Status = "Completed"

		if err := collection.Update(bson.M{"id": id}, trans); err != nil {
			return err
		}

		return nil
	}
	return util.ErrTransactionIdInvalid
}

// FindAgentTransactions- is method for getting all the transactions done by an agent
func (repo *TransactionRepository) FindAgentTransactions(id string) ([]*Transaction, error) {
	var transactions []*Transaction

	collection := repo.Db.Query("transactions")

	// TODO(brad): Sweet, this is how you should do all your checks, fail fast then continue if the logic is valid
	if validateID(id) != true {
		return nil, util.ErrTransactionAgentIdInvalid
	}

	if err := collection.Find(bson.M{"agentInId": bson.ObjectIdHex(id)}).All(&transactions); err != nil {
		return nil, err
	}

	return transactions, nil
}

// FindAgentPayouts - is method for retrieving payouts
func (repo *TransactionRepository) FindAgentPayouts(id string) ([]*Transaction, error) {
	var transactions []*Transaction

	collection := repo.Db.Query("transactions")

	if validateID(id) != true {
		return nil, util.ErrTransactionAgentIdInvalid
	}

	if err := collection.Find(bson.M{"agentOutId": bson.ObjectIdHex(id)}).All(&transactions); err != nil {
		return nil, err
	}

	return transactions, nil
}

// GetTransactionByRef - is a method for getting a transaction to be completed
func (repo *TransactionRepository) GetTransactionByRef(ref string) (*Transaction, error) {
	collection := repo.Db.Query("transactions")
	var trans *Transaction

	if err := collection.Find(bson.M{"referenceNumber": ref}).One(&trans); err != nil {
		return nil, err
	}

	if trans.Status == "Pending" {
		return trans, nil
	}

	if trans.Status == "Completed" {
		return nil, util.ErrTransactionCompleted
	}

	return nil, util.ErrTransactionRetrieveFail
}
