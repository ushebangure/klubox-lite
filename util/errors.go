package util

// Error global struct
type Error struct {
	ErrorCode      string `json:"errorCode"`
	DisplayMessage string `json:"displayMessage"`
	FaultMessage   string `json:"faultMessage"`
}

// NewError creates a new error
func NewError(errorCode, displayMessage, faultMessage string) Error {
	return Error{
		ErrorCode:      errorCode,
		DisplayMessage: displayMessage,
		FaultMessage:   faultMessage,
	}
}
