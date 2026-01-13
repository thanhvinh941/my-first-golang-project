package app

import (
	"my-project/backend/internal/router"
	"my-project/backend/internal/user"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type App struct {
	Router *gin.Engine
	User   *user.Module
}

func New(db *pgxpool.Pool) *App {
	userModule := user.NewModule(db)

	r := router.New(router.ModuleRouter{Handler: userModule.Handler})

	return &App{
		Router: r,
		User:   userModule,
	}
}
