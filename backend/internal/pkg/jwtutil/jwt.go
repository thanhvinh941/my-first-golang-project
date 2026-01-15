package jwtutil

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type TokenManager interface {
	Sign(userID uint, ttl time.Duration) (string, error)
	Parse(token string) (*jwt.Token, jwt.MapClaims, error)
}

type HMAC struct{ key []byte }

func NewHMAC(key []byte) *HMAC { return &HMAC{key: key} }

func (h *HMAC) Sign(userID uint, ttl time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"id":  userID,
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(ttl).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(h.key)
}

func (h *HMAC) Parse(tokenStr string) (*jwt.Token, jwt.MapClaims, error) {
	var claims jwt.MapClaims
	tk, err := jwt.ParseWithClaims(tokenStr, jwt.MapClaims{}, func(t *jwt.Token) (interface{}, error) {
		return h.key, nil
	})
	if tk != nil {
		if c, ok := tk.Claims.(jwt.MapClaims); ok {
			claims = c
		}
	}
	return tk, claims, err
}
