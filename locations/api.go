package location

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/unrolled/render"

	"klubox/util"
)

// LocationHandler is a location handler struct
type LocationHandler struct {
	LocService LocationService
	Formatter  *render.Render
}

// AddLocationH - is a method for adding a location
func (handler *LocationHandler) AddLocationH(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	payload := &Location{}

	if err := json.NewDecoder(req.Body).Decode(payload); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("3001",
			"Invalid JSON payload supplied.", err.Error()))
		return
	}

	if err := payload.Validate(); err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("3002",
			"Unable to validate the location payload provided.", err.Error()))
		return
	}

	location, err := handler.LocService.AddLocation(payload)

	if err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("3003",
			"Unable to add location.", err.Error()))
		return
	}

	handler.Formatter.JSON(w, http.StatusCreated, location)
}

// GetLocationsH - method for getting the locations
func (handler *LocationHandler) GetLocationsH() ([]*Location, error) {
	locations, err := handler.LocService.GetLocations()

	if err != nil {
		handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("3004", "locations' retrieval failed", err.Error()))
		return
	}

	handler.Formatter.JSON(w, http.StatusOK, locations)
}

// RemoveLocationH - method for removing a location
func (handler *LocationHandler) RemoveLocationH(w http.ResponseWriter, req http.Request, params httprouter.Params) {
	id := params.ByName("id")

	if validateID(id) {
		if err := handler.LocService.RemoveLocation(id); err != nil {
			handler.Formatter(w, http.StatusBadRequest, util.NewError("3005", "Could not remove location", err.Error()))
			return
		}

		handler.Formatter.JSON(w, http.StatusAccepted, interface{})
		return
	}

	handler.Formatter.JSON(w, http.StatusBadRequest, util.NewError("3006", "Id param not valid", error.New("ID param not valid")))
}
