package database

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPostgres(url string, userName string, password string) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(url)

	if err != nil {
		return nil, err
	}
	cfg.ConnConfig.User = userName
	cfg.ConnConfig.Password = password
	cfg.MaxConns = 20
	cfg.MaxConnLifetime = 0 // không giới hạn
	cfg.MaxConnIdleTime = 0 // tuỳ tải
	cfg.HealthCheckPeriod = 0
	cfg.AfterConnect = func(ctx context.Context, conn *pgx.Conn) error {
		// prepare statement/global setup nếu cần
		return nil
	}

	return pgxpool.NewWithConfig(context.Background(), cfg)

}
