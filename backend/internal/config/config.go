package config

import "os"

type Config struct {
	DbConfig     DbConfig
	ServerConfig ServerConfig
}

type DbConfig struct {
	Url      string
	Username string
	Password string
}

type ServerConfig struct {
	Port    string
	AppName string
	Env     string
}

func Load() Config {
	return Config{
		DbConfig: DbConfig{
			Url:      os.Getenv("DATABASE_URL"),
			Username: os.Getenv("USERNAME"),
			Password: os.Getenv("PASSWORD"),
		},
		ServerConfig: ServerConfig{
			Port:    os.Getenv("PORT"),
			AppName: os.Getenv("APP_NAME"),
			Env:     os.Getenv("APP_NAME"),
		},
	}
}
