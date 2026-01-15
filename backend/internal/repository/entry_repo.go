// internal/repository/entry_repo.go
package repository

import (
	"context"
	"my-project/backend/internal/dto"
)

type EntryRepository interface {
	Create(ctx context.Context, e *dto.EntryDto) error
	ListByUserID(ctx context.Context, userID uint) ([]dto.EntryDto, error)
}
