package transactions

import (
  "time"

  "klubox/util"
)

// TransactionService is an implementation of the transaction service
type TransactionService struct {
  Repo TransactionRepository
}

// AddTransaction is a service method for adding a transaction
func (transService *TransactionService) AddTransaction(trans *Transaction) (*Transaction, error) {
  if transaction, err := transService.Repo.Save(trans); err != nil {
    return nil, err
  }
   return transaction, nil
}

// GetTransactions is a method for retrieving the transactions
func (transService *TransactionService) GetAllTransactions () ([]*Transaction, error) {
  if transactions, err := transService.Repo.FindAll(); err != nil {
    return nil, err
  }

  return transactions, nil
}

// GetTransactionsUsingFilters is a method for getting users using the filters name and date range
func (transService *TransactionService) GetTransactionsUsingFilters(filter string, dateFrom time.Time, dateTo time.Time) ([]*Transaction, error) {
  if transactions, err := transService.Repo.FindByFilters(filter, dateFrom, dateTo); err != nil {
    return nil, err
  }

  return transactions, nil
}

// GetAgentTransactions - is a service method for getting an agent's transactions
func (transService *TransactionService) GetAgentTransactions (id string) ([]*Transaction, error) {
  if transactions, err := transService.Repo.FindAgentTransactions (id); err != nil {
    return nil, err
  }

  return transactions, nil
}

// GetAgentPayouts - is a service method for getting an agent's payouts
func (transService *TransactionService) GetAgentPayouts (id string) ([]*Transaction, error) {
  if transactions, err := transService.Repo.FindAgentPayouts (id); err != nil {
    return nil, err
  }

  return transactions, nil
}

// UpdateTransaction is a service method for updating the transaction status
func (transService *TransactionService) UpdateTransaction (id string, agentId string) error {
  if err := transService.Repo.UpdateTransaction(id, agentId); err != nil {
    return err
  }

  return nil
}

// GetTransactionByRef - is a service method for a getting a transaction for payout
func (transService *TransactionService) GetTransactionByRef (ref string) (*Transaction, error) {
  if trans, err := transService.Repo.GetTransactionByRef(ref); er != nil {
    return nil, err
  }

  return trans, nil
}
