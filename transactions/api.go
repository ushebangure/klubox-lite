package transactions

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/unrolled/render"

	"klubox/util"
)

/*
TODO(brad): (1) General comments for this file, don't increment err variables, reuse err
			(2) Try use this format the format below instead of `if err := json.NewDecoder(req); err := nil {}
				`err := json.NewDecoder(req)
				 if err != nil {
				 	// handle error
				 }`
*/

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

<<<<<<< HEAD
	if err := payload.Validate(); err != nil {
=======
	// TODO(brad): Don't increment the err variable, reuse err not change it to err1, err2 e.t.c
	if err1 := payload.Validate(); err1 != nil {
>>>>>>> 55044d2f43bbe7bfae778a534f931a3ed154a2fb
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4002",
			"Unable to validate the transaction payload provided.", err.Error()))
		return
	}

<<<<<<< HEAD
	transaction, err := handler.TransService.AddTransaction(payload)

	if err != nil {
=======
	// TODO(brad): Same as above with the err variable, remember the scope is only valid within the if braces (e.g. {})
	if transaction, err2 := handler.TransService.AddTransaction(payload); err2 != nil {
>>>>>>> 55044d2f43bbe7bfae778a534f931a3ed154a2fb
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4003",
			"Unable to add transaction.", err.Error()))
		return
	}
	// TODO(brad): `transactions` will be invalid here because it's scope is in the if {} block, take it out and check err separately as suggested at the beginning of this file
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

	transactions, err := handler.TransService.GetTransactionsUsingFilters(payload.filter, payload.dateFrom, payload.dateTo)

	if err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4004", "Transactions' retrieval failed", err.Error()))
		return
	}
	// TODO(brad): `transactions` will be invalid here because it's scope is in the if {} block, take it out and check err separately as suggested at the beginning of this file
	handler.Formatter.JSON(w, http.StatusOK, transactions)
}

// GetAgentTransactionsH is a handler method for getting all the agent transactions
func (handler *TransactionHandler) GetAgentTransactionsH(w http.ResponseWriter, req http.Request, params httprouter.Params) {
	id := params.ByName("id")

	// TODO(brad): What happens when it's not a valide ID? Case doesn't seem to be handled out side the if statement
	// Rather fail early by checking `if !validateID(id) { // Throw error }` then continue with the rest of the checks if valid
	if validateID(id) {
		transactions, err := handler.TransService.GetAgentTransactions(id)

		if err != nil {
			handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4005", "Could not get agent's transactions", err.Error()))
			return
		}
		// TODO(brad): `transactions` will be invalid here because it's scope is in the if {} block, take it out and check err separately as suggested at the beginning of this file
		handler.Formatter.JSON(w, http.StatusAccepted, transactions)
		return
	}
}

// GetAgentPayoutsH is a handler method for getting all the agent payouts
func (handler *TransactionHandler) GetAgentPayoutsH(w http.ResponseWriter, req http.Request, params httprouter.Params) {
	id := params.ByName("id")

	// TODO(brad): Same as the above with an invalid ID
	if validateID(id) {
		transactions, err := handler.TransService.GetAgentPayouts(id)

		if err != nil {
			handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4006", "Could not get agent's payouts", err.Error()))
			return
		}
		// TODO(brad): `transactions` will be invalid here because it's scope is in the if {} block, take it out and check err separately as suggested at the beginning of this file
		handler.Formatter.JSON(w, http.StatusAccepted, transactions)
		return
	}
}

// CompletePayoutH is a method for completing a payout, it updates the transaction status to completed
func (handler *TransactionHandler) CompletePayoutH(w http.ResponseWriter, req http.Request, params httprouter.Params) {
	id := params.ByName("id")
	// TODO(brad): This needs to be &agentId{} not *agentId{}
	payload := *agentId{}

	if err := json.NewDecoder(req.Body).Decode(payload); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4001",
			"Invalid transaction JSON payload supplied.", err.Error()))
		return
	}

	// TODO(brad): Fail early again and check for `if !validateID(id) {} || !validateID(payload)` and throw error
	if validateID(id) && validateID(payload.id) {
		transactions, err := handler.TransService.CompletePayout(id)

		if err != nil {
			handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4006", "Could not get agent's payouts", err.Error()))
			return
		}
		// TODO(brad): `transactions` will be invalid here because it's scope is in the if {} block, take it out and check err separately as suggested at the beginning of this file
		handler.Formatter.JSON(w, http.StatusAccepted, transactions)
		return
	}
	handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("4007", "Id param not valid", error.New("ID param not valid")))
}

// GetTransactionByRefH is a method for getting a transaction for payout
func (handler *TransactionHandler) GetTransactionByRefH(w http.ResponseWriter, req http.Request, params httprouter.Params) {
	ref := params.ByName("reference")

	transaction, err := handler.TransService.GetTransactionByRef(ref);

	if err != nil {
		handler.Formatter(w, http.StatusBadRequest, util.NewError("4008", "Transaction retrieval failed", err.Error()))
	}

	handler.Formatter.JSON(w, http.StatusOK, transaction)
}
