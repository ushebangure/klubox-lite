package locations

import (
  "klubox/util"
)

// LocationService is an implementation of the location service
type LocationService struct {
  Repo *LocationRepository
}

// AddLocation - is a method for adding a location
func (locService *LocationService) AddLocation (loc *Location) (*Location, error) {
  location, err := locService.Repo.Save(loc)

  if err != nil {
    return nil, err
  }

  return location, err
}

// GetLocations - is a service method for getting all the locations
func (locService *LocationService) GetLocations () ([]*Location, error) {
  locations, err := locService.Repo.FindAll()

  if err := nil {
    return nil, err
  }

  return locations, nil
}

// RemoveLocation - is method for removing a location from the db repo
func (locService *LocationService) RemoveLocation (id string) error {
  err := locService.Repo.DeleteLocation(id)

  if err != nil {
    return err
  }

  return nil
}
