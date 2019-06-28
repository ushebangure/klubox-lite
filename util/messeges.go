package util

import "errors"

var (

	/*------------------------- Rest Validation Error Messages ------------------------*/
	/*---------------------------------------------------------------------------------*/

	// ErrNameMissing in the request body.
	ErrNameMissing = errors.New("Required field 'name' is missing from the request body. Please check your documentation")

	// ErrSurnameMissing in the request body.
	ErrSurnameMissing = errors.New("Required field 'surname' is missing from the request body. Please check your documentation")

	// ErrEmailMissing in the request body.
	ErrEmailMissing = errors.New("Required field 'email' is either missing from the request body or is invalid. Please check your documentation")

	// ErrUsernameMissing in the request body.
	ErrUsernameMissing = errors.New("Required field 'username' is missing from the request body. Please check your documentation")

	// ErrPasswordMissing in the request body.
	ErrPasswordMissing = errors.New("Required field 'password' is missing from the request body. Please check your documentation")

	// ErrInvalidRole in the request body.
	ErrInvalidRole = errors.New("Invalid 'role' provided. Please check your documentation")

	// ErrInvalidQueryParams in the request body.
	ErrInvalidQueryParams = errors.New("Invalid query param in the ids field. Please check your documentation")

	/*------------------------- Server Error Messages ------------------------*/
	/*------------------------------------------------------------------------*/

	// ErrPasswordEncryption in the service
	ErrPasswordEncryption = errors.New("Failed to encrypt user password")

	// ErrInvalidPassword in the service
	ErrInvalidPassword = errors.New("Invalid password provided for this user")

	// ErrMismatchingEmails in the service
	ErrMismatchingEmails = errors.New("Invalid email provided for this user")

	// ErrUnauthorized error
	ErrUnauthorized = errors.New("Token is unauthorized")

	// ErrNoPermissions error
	ErrNoPermissions = errors.New("Not enough permissions")

	// ErrExpired error
	ErrExpired = errors.New("Token is expired")

	// ErrNoTokenFound error
	ErrNoTokenFound = errors.New("No token found")

	/*------------------------- Domain Error Messages ------------------------*/
	/*------------------------------------------------------------------------*/

	// ErrUserExist User already exist error
	ErrUserExist = errors.New("User already exists")

	// ErrUserEmailExist User email already exist error
	ErrUserEmailExist = errors.New("User email already exists")

	// ErrUserPhoneExist User cellphone already exist error
	ErrUserPhoneExist = errors.New("User phone number already exists")

	// ErrUserNotFound User not found error
	ErrUserNotFound = errors.New("Failed to retrieve User")

	// ErrUserNotCreated User not created error
	ErrUserNotCreated = errors.New("Failed to create User")

	// ErrUserDBGeneral User database connection error
	ErrUserDBGeneral = errors.New("Failed to connect with the user database")

	// ErrNoUsersFound request for the the users list could not be done
	ErrNoUsersFound = errors.New("Failed to get the users")

	// ErrUserNotRemoved - error for when removing a user from the database Failed
	ErrUserNotRemoved = errors.New("Failed to delete the user from the Database")

	//ErrUserNotUpdated - error for when updating a user in the database Failed
	ErrUserNotUpdated = errors.New("Failed to update the user from the Database")

	/*Currency service errors*/

	//ErrCurrencyExists - error currency already exists
	ErrCurrencyExists = errors.New("Currency already exists")

	//ErrDBError - database error
	ErrDBError = errors.New("Database error")

	//ErrCurrencyNotCreated - error currency not created
	ErrCurrencyNotCreated = errors.New("Currency could not be created")

	//ErrNoCurrenciesFound - error no currencies found
	ErrNoCurrenciesFound = errors.New("No currencies found")

	//ErrCurrencyDoesNotExist - currency does not exist
	ErrCurrencyDoesNotExist = errors.New("Currency to be deleted does not exist")

	//ErrCurrencyDeleteFail - error currency could not be deleted
	ErrCurrencyDeleteFail = errors.New("Currency could not be deleted")

	//ErrCurrencyUpdateFailure - error currency update failed
	ErrCurrencyUpdateFailure = errors.New("Currency could not be updated")

	//ErrCannotGetCurrencies - error coulf not get currencies
	ErrCannotGetCurrencies = errors.New("Could not get currencies")

	// ErrCurrencyNameMissing - error validation - currency name missing
	ErrCurrencyNameMissing = errors.New("Validation error: currency name missing")

	// ErrCurrencyValueFalsy - validation error - value not valid
	ErrCurrencyValueFalsy = errors.New("Validation error: currency value is not valid")

	/*
		Location service errors
	*/

	// ErrLocationNameMissing - validation error - location name missing
	ErrLocationNameMissing = errors.New("Validation error - name missing")

	// ErrLocationNotAdded - location not added
	ErrLocationNotAdded = errors.New("Location not added")

	// ErrLocationDoesNotExist - error location does not exist
	ErrLocationDoesNotExist = errors.New("Location to be deleted does not exist")

	// ErrLocationNotDeleted - error locatin not deleted
	ErrLocationNotDeleted = errors.New("Location not deleted")

	/*
		Transaction service errors
	*/

	// ErrTransactionInvalidSender - error invalid sender
	ErrTransactionInvalidSender = errors.New("Transaction sender object not valid")

	// ErrTransactionInvalidReceiver - error invalid receiver
	ErrTransactionInvalidReceiver = errors.New("Transaction receiver object not valid")

	// ErrTransactionInvalidCurrency - invalid currency supplied
	ErrTransactionInvalidCurrency = errors.New("Transaction currencies are invalid")

	// ErrTransactionInvalidAmount - invalid total to pay or amount to send
	ErrTransactionInvalidAmount = errors.New("Transaction amount to send or total to pay is invalid")

	// ErrTransactionAgentIdMissing - invalid agent id supplied
	ErrTransactionAgentIdMissing = errors.New("Transaction agent id is invalid")

	// ErrTransactionRefExists - error transaction ref exists
	ErrTransactionRefExists = errors.New("Transaction ref already exists")

	// ErrTransactionInsertFail - error transaction could not be recorded
	ErrTransactionInsertFail = errors.New("Transaction could not be recorded")

	// ErrTransactionDoesNotExist - error transaction does not exist
	ErrTransactionDoesNotExist = errors.New("Transaction does not exist")

	// ErrTransactionAgentIdInvalid - error transaction id not valid
	ErrTransactionAgentIdInvalid = errors.New("Transaction agent id is not valid")

	// ErrTransactionIdInvalid - error transaction id is not valid
	ErrTransactionIdInvalid = errors.New("Transaction id is invalid")

	// ErrTransactionCompleted -error transaction already completed
	ErrTransactionCompleted = errors.New("Payout already done")

	// ErrTransactionRetrieveFail - error payout already done
	ErrTransactionRetrieveFail = errors.New("Transaction retrieval failed")
)
