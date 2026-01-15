// internal/repository/user_repo.go
package repository

import (
	"context"
	"my-project/backend/internal/dto"
)

type UserRepository interface {
	Create(ctx context.Context, u *dto.UserDto) error
	FindByUsername(ctx context.Context, username string) (*dto.UserDto, error)
	FindByID(ctx context.Context, id uint) (*dto.UserDto, error)
}
