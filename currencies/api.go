package currencies

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/unrolled/render"

	"klubox/util"
)

// CurrencyHandler is a currency handler struct
type CurrencyHandler struct {
	CurrService CurrencyService
	Formatter   *render.Render
}

// AddCurrencyH - handler method for adding currency to database
func (handler *CurrencyHandler) AddCurrencyH(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	payload := &Currency{}

	if err := json.NewDecoder(req.Body).Decode(payload); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("2001",
			"Invalid JSON payload supplied.", err.Error()))
		return
	}

	if err := payload.Validate(); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("2002",
			"Unable to validate the currency payload provided.", err.Error()))
		return
	}

	currency, err := handler.UserService.CreateUser(payload)

	if err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("2003",
			"Unable to add currency.", err.Error()))
		return
	}

	handler.Formatter.JSON(w, http.StatusCreated, currency)
}

// GetCurrenciesH - handler method for getting currencies
func (handler *CurrencyHandler) GetCurrenciesH(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	currencies, err := handler.CurrService.GetCurrencies()

	if err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("2004", "Currencies' retrieval failed", err.Error()))
		return
	}

	handler.Formatter.JSON(w, http.StatusOK, currencies)
}

// RemoveCurrencyH - handler method for removing a currency
func (handler *CurrencyHandler) RemoveCurrencyH(w http.ResponseWriter, req *http.Request, params httprouter.Params) {
	id := params.ByName("id")

	if validateID(id) {
		if err := handler.CurrService.RemoveCurrency(id); err != nil {
			handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("2005", "Could not remove currency", err.Error()))
			return
		}

		handler.Formatter.JSON(w, http.StatusAccepted, interface{})
		return
	}

	handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("2006", "Id param not valid", error.New("ID param not valid")))
}

// UpdateCurrencyH - handler method for updating a currency
func (handler *CurrencyHandler) UpdateCurrencyH(w http.ResponseWriter, req *http.Request, params httprouter) {
	payload := &Currency{}
	id := params.ByName("id")

	if err := json.NewDecoder(req.Body).Decode(payload); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("2001",
			"Invalid JSON payload supplied.", err.Error()))
		return
	}

	if validateID(id) {
		curr, err := handler.CurrService.UpdateCurrency(id, payload)
		if err != nil {
			handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("2007", "Could not remove currency", err.Error()))
			return
		}

		handler.Formatter.JSON(w, http.StatusAccepted, curr)
		return
	}

	handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("2005", "Id param not valid", error.New("ID param not valid")))
}
