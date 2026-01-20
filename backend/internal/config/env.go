package config

import (
	"log"
	"github.com/joho/godotenv"
)

// LoadEnv loads environment variables from .env if present
func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println(".env not found, using system environment")
	}
}
