package main

import (
	"log"
	"my-project/backend/internal/app"
	"my-project/backend/internal/config"
	"my-project/backend/internal/database"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	cfg := config.Load()
	db, err := database.NewPostgres(cfg.DbConfig.Url, cfg.DbConfig.Username, cfg.DbConfig.Password)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	app := app.New(db)

	log.Println("API running on :" + cfg.ServerConfig.Port)
	app.Router.Run(cfg.ServerConfig.Port)
}
