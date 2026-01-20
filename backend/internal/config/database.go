package config

import (
	"os"

	"github.com/glebarez/sqlite" // <--- Importante: Import do Glebarez
	"gorm.io/gorm"
)

func InitDB() (*gorm.DB, error) {
	dbPath := os.Getenv("DATABASE_URL")
	if dbPath == "" {
		dbPath = "ecommerce.db"
	}

	// Glebarez usa modernc/sqlite (Pure Go) por baixo dos panos
	return gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
}
