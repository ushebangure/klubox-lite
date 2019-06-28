package transactions

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/unrolled/render"

	"klubox/util"
)

// TransactionHandler is a transaction handler struct
type TransactionHandler struct {
	TransService TransactionService
	Formatter    *render.Render
}

type filterType struct {
	filter   string
	dateFrom time.Time
	dateTo   time.Time
}

type agentId struct {
	id string
}

// AddTransactionH is the handler method for adding a transaction
func (handler *TransactionHandler) AddTransactionH(w http.ResponseWriter, req http.Request, _ httprouter.Params) {
	payload := &Transaction{}

	if err := json.NewDecoder(req.Body).Decode(payload); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4001",
			"Invalid transaction JSON payload supplied.", err.Error()))
		return
	}

	if err1 := payload.Validate(); err1 != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4002",
			"Unable to validate the transaction payload provided.", err1.Error()))
		return
	}

	if transaction, err2 := handler.TransService.AddTransaction(payload); err2 != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4003",
			"Unable to add transaction.", err2.Error()))
		return
	}

	handler.Formatter.JSON(w, http.StatusCreated, transaction)
}

// GetTransactionsUsingFiltersH - method for getting transactions using filters
func (handler *TransactionHandler) GetTransactionsUsingFiltersH(w http.ResponseWriter, req http.Request, _ httprouter.Params) {
	payload := &Transaction{}

	if err := json.NewDecoder(req.Body).Decode(payload); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4001",
			"Invalid JSON payload supplied.", err.Error()))
		return
	}

	if transactions, err1 := handler.TransService.GetTransactionsUsingFilters(payload.filter, payload.dateFrom, payload.dateTo); err1 != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4004", "Transactions' retrieval failed", err1.Error()))
		return
	}

	handler.Formatter.JSON(w, http.StatusOK, transactions)
}

// GetAgentTransactionsH is a handler method for getting all the agent transactions
func (handler *TransactionHandler) GetAgentTransactionsH(w http.ResponseWriter, req http.Request, params httprouter.Params) {
	id := params.ByName("id")

	if validateID(id) {
		if transactions, err := handler.TransService.GetAgentTransactions(id); err != nil {
			handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4005", "Could not get agent's transactions", err.Error()))
			return
		}

		handler.Formatter.JSON(w, http.StatusAccepted, transactions)
		return
	}
}

// GetAgentPayoutsH is a handler method for getting all the agent payouts
func (handler *TransactionHandler) GetAgentPayoutsH(w http.ResponseWriter, req http.Request, params httprouter.Params) {
	id := params.ByName("id")

	if validateID(id) {
		if transactions, err := handler.TransService.GetAgentPayouts(id); err != nil {
			handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4006", "Could not get agent's payouts", err.Error()))
			return
		}

		handler.Formatter.JSON(w, http.StatusAccepted, transactions)
		return
	}
}

// CompletePayoutH is a method for completing a payout, it updates the transaction status to completed
func (handler *TransactionHandler) CompletePayoutH(w http.ResponseWriter, req http.Request, params httprouter.Params) {
	id := params.ByName("id")
	payload := *agentId{}

	if err := json.NewDecoder(req.Body).Decode(payload); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4001",
			"Invalid transaction JSON payload supplied.", err.Error()))
		return
	}

	if validateID(id) && validateID(payload.id) {
		if transactions, err1 := handler.TransService.CompletePayout(id); err1 != nil {
			handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4006", "Could not get agent's payouts", err1.Error()))
			return
		}

		handler.Formatter.JSON(w, http.StatusAccepted, transactions)
		return
	}
	handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4007", "Id param not valid", error.New("ID param not valid")))
}

// GetTransactionByRefH is a method for getting a transaction for payout
func (handler *TransactionHandler) GetTransactionByRefH(w http.ResponseWriter, req http.Request, params httprouter.Params) {
	ref := params.ByName("reference")

	if transaction, err := handler.TransService.GetTransactionByRef(ref); err != nil {
		handler.Formatter(w, http.StatusBadRequest, util.NewError("4008", "Transaction retrieval failed", err.Error()))
	}

	handler.Formatter.JSON(w, http.StatusOK, transaction)
}
