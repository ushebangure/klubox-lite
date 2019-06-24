package transactions

import (
  "time"
  "fmt"

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
  if err1 := trans.Validate(); err1 != nil {
    return err1
  }

  collection := repo.Db.Query("transactions")
  query := bson.M{"referenceNumber": trans.ReferenceNumber}

  trans.ID = db.NewID()
  trans.Status = "Pending"
  trans.CreatedAt = time.Now()
  trans.UpdatedAt = time.Now()

  if count, err := collection.Find(query).Count(); err != nil {
    return nil, err
  }

  if count > 0 {
    return nil, util.ErrTransactionRefExists
  }

  if err2 = collection.Insert(trans); err2 != nil {
    return nil, err2
  }

  return trans, nil
}

// FindAll is a method for getting all the transactions
func (repo *TransactionRepository) FindAll () ([]*Transaction, error) {
  collection := repo.Db.Query("transactions")
  var transactions []*Transaction

  if  err := collection.Find(bson.M{}).All(&transactions); err != nil {
    return nil, err
  }

  return transactions, nil
}

// FindByFilters - method for getting transactions using filters - dateRange and filter
func (repo *TransactionRepository) FindByFilters (filter string, dateTo *time.Time, dateFrom *time.Time) ([]*Transaction, error) {
  collection := repo.Db.Query("transactions")
  var transactions []*Transaction
  var transactions1 []*Transaction
  var transactions2 []*Transaction
  var transactions3 []*Transaction
  var transactions4 []*Transaction

  if filter != "" {
    query := bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "sender.Name": {"$regex": filter}}

    if  err := collection.Find(query).All(&transactions); err != nil {
      return nil, err
    }

    query1 := bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "sender.Surname": {"$regex": filter}}

    if  err1 := collection.Find(query1).All(&transactions1); err1 != nil {
      return nil, err1
    }

    transactions = append(transactions, transactions1...)

    query2 = bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "receiver.Name": {"$regex": filter}}

    if  err2 := collection.Find(query2).All(&transactions2); err2 != nil {
      return nil, err2
    }

    transactions = append(transactions, transactions2...)

    query3 := bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "receiver.Surname": {"$regex": filter}}

    if  err3 := collection.Find(query3).All(&transactions3); err3 != nil {
      return nil, err3
    }

    transactions = append(transactions, transactions3...)

    query4 := bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}, "referenceNumber": {"$regex": filter}}

    if  err4 := collection.Find(query4).All(&transactions4); err4 != nil {
      return nil, err4
    }

    transactions = append(transactions, transactions4...)
  } else {
    query := bson.M{"created": {"$gte": dateFrom, "$lte": dateFrom}}

    if  err5 := collection.Find(query).All(&transactions); err5 != nil {
      return nil, err5
    }
  }

  return transactions, nil
}

// UpdateTransaction is the method for updating the transaction when payout occurs
func (repo *TransactionRepository) UpdateTransaction (id string, agentId string) error {
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

   if err2 := collection.Update(bson.M{"id": id}, trans); err2 != nil {
     return err2
   }

   return nil
  }
  return util.ErrTransactionIdInvalid
}

// FindAgentTransactions- is method for getting all the transactions done by an agent
func (repo *TransactionRepository) FindAgentTransactions (id string) ([]*Transaction, error) {
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
func (repo *TransactionRepository) FindAgentPayouts (id string) ([]*Transaction, error) {
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
func (repo *TransactionRepository) GetTransactionByRef (ref string) (*Transaction, error) {
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
