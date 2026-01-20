package seeds

import (
	"log"
	"gorm.io/gorm"
	"ecommerce/internal/domain"
)

// Run seeds basic data
func Run(db *gorm.DB) {
	categories := []map[string]string{
		{"name": "Roupas Femininas", "slug": "roupas-femininas"},
		{"name": "Vestidos", "slug": "vestidos"},
		{"name": "Blusas", "slug": "blusas"},
		{"name": "Calças", "slug": "calcas"},
		{"name": "Saias", "slug": "saias"},
		{"name": "Roupas Masculinas", "slug": "roupas-masculinas"},
		{"name": "Acessórios", "slug": "acessorios"},
		{"name": "Bolsas", "slug": "bolsas"},
		{"name": "Joias", "slug": "joias"},
		{"name": "Relógios", "slug": "relogios"},
		{"name": "Calçados", "slug": "calcados"},
		{"name": "Sandálias", "slug": "sandalias"},
		{"name": "Tênis", "slug": "tenis"},
		{"name": "Sapatos", "slug": "sapatos"},
	}
	for _, c := range categories {
		if err := db.Exec("INSERT INTO categories (name, slug) VALUES (?, ?) ON CONFLICT (slug) DO NOTHING", c["name"], c["slug"]).Error; err != nil {
			log.Println("seed category error:", err)
		}
	}

	// Example product
	p := domain.Product{
		Name:        "Vestido Midi Minimalista",
		Slug:        "vestido-midi-minimalista",
		Description: "Vestido midi elegante inspirado em linhas minimalistas.",
		Price:       299.90,
		StockQuantity: 25,
		IsActive:    true,
		IsFeatured:  true,
	}
	if err := db.Exec("INSERT INTO products (name, slug, description, price, stock_quantity, is_active, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (slug) DO NOTHING",
		p.Name, p.Slug, p.Description, p.Price, p.StockQuantity, p.IsActive, p.IsFeatured).Error; err != nil {
		log.Println("seed product error:", err)
	}
}
