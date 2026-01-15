package hash

import "golang.org/x/crypto/bcrypt"

type Hasher interface {
	Hash(pw string) (string, error)
	Compare(hash, pw string) error
}

type Bcrypt struct{}

func (Bcrypt) Hash(pw string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	return string(b), err
}
func (Bcrypt) Compare(hash, pw string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pw))
}
