package service

import (
	"context"
	"my-project/backend/internal/dto"
	"my-project/backend/internal/repository"
	"time"
)

type EntryService interface {
	Create(ctx context.Context, userID uint, in dto.CreateEntryInputDto) (*dto.EntryDto, error)
	ListMine(ctx context.Context, userID uint) ([]dto.EntryDto, error)
}

type entryService struct {
	entries repository.EntryRepository
}

func NewEntryService(entries repository.EntryRepository) EntryService {
	return &entryService{entries: entries}
}

func (s *entryService) Create(ctx context.Context, userID uint, in dto.CreateEntryInputDto) (*dto.EntryDto, error) {
	e := &dto.EntryDto{UserID: userID, Content: in.Content, CreatedAt: time.Now()}
	if err := s.entries.Create(ctx, e); err != nil {
		return nil, err
	}
	return e, nil
}

func (s *entryService) ListMine(ctx context.Context, userID uint) ([]dto.EntryDto, error) {
	return s.entries.ListByUserID(ctx, userID)
}
