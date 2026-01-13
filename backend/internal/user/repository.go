package user

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(ctx context.Context, u *User) error {
	return r.db.QueryRow(ctx,
		`INSERT INTO users (name, email) VALUES ($1,$2)
		 RETURNING id, created_at`,
		u.Name, u.Email,
	).Scan(&u.ID, &u.CreatedAt)
}

func (r *Repository) List(ctx context.Context) ([]User, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id,name,email,created_at FROM users`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		rows.Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt)
		users = append(users, u)
	}
	return users, nil
}

func (r *Repository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.Exec(ctx,
		`DELETE FROM users WHERE id=$1`, id)
	return err
}
