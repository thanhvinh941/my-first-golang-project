package gormrepo

import (
	"context"
	"my-project/backend/internal/dto"
	"my-project/backend/internal/repository"

	"gorm.io/gorm"
)

type UserGorm struct{ db *gorm.DB }

var _ repository.UserRepository = (*UserGorm)(nil)

func NewUserGorm(db *gorm.DB) *UserGorm { return &UserGorm{db: db} }

func (r *UserGorm) Create(ctx context.Context, u *dto.UserDto) error {
	m := &UserModel{Username: u.Username, PasswordHash: u.PasswordHash}
	if err := r.db.WithContext(ctx).Create(m).Error; err != nil {
		return err
	}
	u.ID = m.ID
	return nil
}

func (r *UserGorm) FindByUsername(ctx context.Context, username string) (*dto.UserDto, error) {
	var m UserModel
	if err := r.db.WithContext(ctx).Where("username = ?", username).First(&m).Error; err != nil {
		return nil, err
	}
	return &dto.UserDto{ID: m.ID, Username: m.Username, PasswordHash: m.PasswordHash}, nil
}

func (r *UserGorm) FindByID(ctx context.Context, id uint) (*dto.UserDto, error) {
	var m UserModel
	if err := r.db.WithContext(ctx).First(&m, id).Error; err != nil {
		return nil, err
	}
	return &dto.UserDto{ID: m.ID, Username: m.Username, PasswordHash: m.PasswordHash}, nil
}
