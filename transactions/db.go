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
	if err := trans.Validate(); err != nil {
		return err
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
	var transactions []*Transaction
	var buffer []*Transaction
	var buffer []*Transaction
	var buffer []*Transaction
	var buffer []*Transaction

	if filter != "" {
		query := bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "sender.Name": {"$regex": filter}}

		if err := collection.Find(query).All(&buffer); err != nil {
			return nil, err
		}

		query = bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "sender.Surname": {"$regex": filter}}

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

		transactions = append(transactions, buffer...)
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
