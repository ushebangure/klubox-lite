package util

type Roles interface {
	name() string
	ordinal() int
	values() *[]string
}

//type Role int
//
//const (
//	UNKNOWN Role = 0
//	ADMIN   Role = 1
//	AGENT   Role = 2
//	PAYOUT  Role = 3
//)

var roleStrings = []string{
	"unknown",
	"agent",
	"admin",
	"payout",
}

func IsValidRole(roles []string) bool {
	for _, r := range roleStrings {
		for _, u := range roles {
			if u == r {
				return true
			}
		}	
	}

	return false
}

//func (r Role) name() string {
//	return roleStrings[r]
//}
//
//func (r Role) ordinal() int {
//	return int(r)
//}

//func (r Role) values() *[]string {
//	return &roleStrings
//}

func Admin() []string {
	return roleStrings[2:3]
}

func Agent() []string {
	return roleStrings[1:3]
}

func Payout() []string {
	return roleStrings[2:]
}
