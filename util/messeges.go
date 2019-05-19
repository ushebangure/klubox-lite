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
)

