package service

import (
	"context"
	"errors"
	"my-project/backend/internal/dto"
	"my-project/backend/internal/pkg/hash"
	"my-project/backend/internal/pkg/jwtutil"
	"my-project/backend/internal/repository"
	"strings"
	"time"
)

type AuthService interface {
	Register(ctx context.Context, in dto.AuthInputDto) (*dto.UserDto, error)
	Login(ctx context.Context, in dto.AuthInputDto) (string, error) // return JWT
	CurrentUser(ctx context.Context, userID uint) (*dto.UserDto, error)
}

type authService struct {
	users repository.UserRepository
	h     hash.Hasher
	tm    jwtutil.TokenManager
	ttl   time.Duration
}

func NewAuthService(users repository.UserRepository, h hash.Hasher, tm jwtutil.TokenManager, ttl time.Duration) AuthService {
	return &authService{users: users, h: h, tm: tm, ttl: ttl}
}

func (s *authService) Register(ctx context.Context, in dto.AuthInputDto) (*dto.UserDto, error) {
	u := &dto.UserDto{Username: strings.TrimSpace(in.Username)}
	if u.Username == "" || len(in.Password) < 6 {
		return nil, errors.New("invalid credentials")
	}
	hash, err := s.h.Hash(in.Password)
	if err != nil {
		return nil, err
	}
	u.PasswordHash = hash
	if err := s.users.Create(ctx, u); err != nil {
		return nil, err
	}
	return u, nil
}

func (s *authService) Login(ctx context.Context, in dto.AuthInputDto) (string, error) {
	u, err := s.users.FindByUsername(ctx, in.Username)
	if err != nil {
		return "", errors.New("user not found")
	}
	if err := s.h.Compare(u.PasswordHash, in.Password); err != nil {
		return "", errors.New("invalid password")
	}
	return s.tm.Sign(u.ID, s.ttl)
}

func (s *authService) CurrentUser(ctx context.Context, userID uint) (*dto.UserDto, error) {
	return s.users.FindByID(ctx, userID)
}
