package dto

import "time"

type EntryDto struct {
	ID        uint
	UserID    uint
	Content   string
	CreatedAt time.Time
}
