package transactions

import (
	"time"
)

// TransactionService is an implementation of the transaction service
type TransactionService struct {
	Repo TransactionRepository
}

// AddTransaction is a service method for adding a transaction
func (transService *TransactionService) AddTransaction(trans *Transaction) (*Transaction, error) {
	transaction, err := transService.Repo.Save(trans)

	if err != nil {
		return nil, err
	}
	return transaction, nil
}

// GetTransactions is a method for retrieving the transactions
func (transService *TransactionService) GetAllTransactions() ([]*Transaction, error) {
	transactions, err := transService.Repo.FindAll()

	if err != nil {
		return nil, err
	}

	return transactions, nil
}

// GetTransactionsUsingFilters is a method for getting users using the filters name and date range
func (transService *TransactionService) GetTransactionsUsingFilters(filter string, dateFrom time.Time, dateTo time.Time) ([]*Transaction, error) {
	transactions, err := transService.Repo.FindByFilters(filter, dateFrom, dateTo)

	if err != nil {
		return nil, err
	}

	return transactions, nil
}

// GetAgentTransactions - is a service method for getting an agent's transactions
func (transService *TransactionService) GetAgentTransactions(id string) ([]*Transaction, error) {
	transactions, err := transService.Repo.FindAgentTransactions(id)

	if err != nil {
		return nil, err
	}

	return transactions, nil
}

// GetAgentPayouts - is a service method for getting an agent's payouts
func (transService *TransactionService) GetAgentPayouts(id string) ([]*Transaction, error) {
	transactions, err := transService.Repo.FindAgentPayouts(id);

	if err != nil {
		return nil, err
	}

	return transactions, nil
}

// UpdateTransaction is a service method for updating the transaction status
func (transService *TransactionService) UpdateTransaction(id string, agentId string) error {
	if err := transService.Repo.UpdateTransaction(id, agentId); err != nil {
		return err
	}

	return nil
}

// GetTransactionByRef - is a service method for a getting a transaction for payout
func (transService *TransactionService) GetTransactionByRef(ref string) (*Transaction, error) {
	trans, err := transService.Repo.GetTransactionByRef(ref)
	
	if err != nil {
		return nil, err
	}

	return trans, nil
}
