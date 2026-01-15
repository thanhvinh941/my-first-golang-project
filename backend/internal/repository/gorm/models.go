package gormrepo

import (
	"time"
)

type UserModel struct {
	ID           uint   `gorm:"primaryKey"`
	Username     string `gorm:"size:255;uniqueIndex;not null"`
	PasswordHash string `gorm:"size:255;not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type EntryModel struct {
	ID        uint   `gorm:"primaryKey"`
	UserID    uint   `gorm:"index;not null"`
	Content   string `gorm:"type:text;not null"`
	CreatedAt time.Time
}
