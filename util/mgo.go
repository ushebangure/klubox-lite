package util

import "gopkg.in/mgo.v2/bson"

// ID is a bson type
type ID bson.ObjectId

// ToString converts from ID type to a string.
func (id ID) ToString() string {
	return bson.ObjectId(id).Hex()
}

// MarshalJSON will marshal ID to JSON.
func (id ID) MarshalJSON() ([]byte, error) {
	return bson.ObjectId(id).MarshalJSON()
}

// UnmarshalJSON will unmarshal a string to an ID.
func (id *ID) UnmarshalJSON(data []byte) error {
	s := string(data)
	s = s[1 : len(s)-1]

	if bson.IsObjectIdHex(s) {
		*id = ID(bson.ObjectIdHex(s))
	}
	return nil
}

// GetBSON implements bson.Getter.
func (id ID) GetBSON() (interface{}, error) {
	if id == "" {
		return "", nil
	}
	return bson.ObjectId(id), nil
}

// SetBSON implements bson.Setter.
func (id *ID) SetBSON(raw bson.Raw) error {
	decoded := new(string)
	bsonErr := raw.Unmarshal(decoded)

	if bsonErr == nil {
		*id = ID(bson.ObjectId(*decoded))
		return nil
	}
	return bsonErr
}

//StringToID convert a string to an ID
func StringToID(s string) ID {
	return ID(bson.ObjectIdHex(s))
}

//IsValidID check if is a valid ID
func IsValidID(s string) bool {
	return bson.IsObjectIdHex(s)
}

//NewID create a new id
func NewID() ID {
	return StringToID(bson.NewObjectId().Hex())
}

