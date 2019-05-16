package authenticator // Claims is a JWT token claims.

import (
	"github.com/dgrijalva/jwt-go"
)

type Claim struct {
	UserID      string
	Role        string
	Permissions []string
}

// NewClaims creates a new Claims based on the provided token data.
func NewClaims(data interface{}) *Claim {
	token, ok := data.(*jwt.Token)
	if !ok {
		return nil
	}

	claim, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil
	}

	userID, ok := claim["uid"].(string)
	if !ok {
		return nil
	}

	permissions, ok := claim["iup"].([]interface{})
	if !ok {
		return nil
	}

	var permissionSlice []string
	for _, permission := range permissions {
		if aPermission, ok := permission.(string); ok {
			permissionSlice = append(permissionSlice, aPermission)
		}
	}

	return &Claim{
		UserID:      string(userID),
		Permissions: permissionSlice,
	}
}

// HasPermission checks if the token claims contains a particular permission.
func (claims *Claim) HasPermission(permission string) bool {
	for _, aPermission := range claims.Permissions {
		if permission == aPermission {
			return true
		}
	}

	return false
}

// HasPermissions checks if the token claims contains the specified permissions.
// The all parameter will check if the token claims contains all the specified permissions.
func (claims *Claim) HasPermissions(permissions []string, all bool) bool {
	for _, permission := range permissions {
		pExists := claims.HasPermission(permission)
		// Checks if the token has all the permissions
		// Checks the token has at least one of the permissions
		if (all && !pExists) || (!all && pExists) {
			return !all
		}
	}

	return all
}

// IsOwner checks if the token claims belongs to the resource owner.
func (claims *Claim) IsOwner(userID string) bool {
	return claims.UserID == userID
}
