package gormrepo

import (
	"context"
	"my-project/backend/internal/dto"
	"my-project/backend/internal/repository"

	"gorm.io/gorm"
)

var _ repository.EntryRepository = (*EntryGorm)(nil)

type EntryGorm struct{ db *gorm.DB }

func NewEntryGorm(db *gorm.DB) *EntryGorm { return &EntryGorm{db: db} }

func (r *EntryGorm) Create(ctx context.Context, e *dto.EntryDto) error {
	m := &EntryModel{UserID: e.UserID, Content: e.Content, CreatedAt: e.CreatedAt}
	if err := r.db.WithContext(ctx).Create(m).Error; err != nil {
		return err
	}
	e.ID = m.ID
	return nil
}

func (r *EntryGorm) ListByUserID(ctx context.Context, userID uint) ([]dto.EntryDto, error) {
	var ms []EntryModel
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("created_at DESC").Find(&ms).Error; err != nil {
		return nil, err
	}
	out := make([]dto.EntryDto, 0, len(ms))
	for _, m := range ms {
		out = append(out, dto.EntryDto{ID: m.ID, UserID: m.UserID, Content: m.Content, CreatedAt: m.CreatedAt})
	}
	return out, nil
}
