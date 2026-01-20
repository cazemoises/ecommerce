package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Product represents the product entity
type Product struct {
	ID                string    `gorm:"type:text;primaryKey" json:"id"`
	SellerID          string    `gorm:"type:text" json:"sellerId"`
	CategoryID        string    `gorm:"type:text" json:"categoryId"`
	Name              string    `gorm:"size:255" json:"name"`
	Slug              string    `gorm:"size:255;uniqueIndex" json:"slug"`
	Description       string    `json:"description"`
	Price             float64   `gorm:"type:real" json:"price"`
	CompareAtPrice    *float64  `gorm:"type:real" json:"compareAtPrice"` // camelCase
	CostPrice         *float64  `gorm:"type:real" json:"costPrice"`      // camelCase
	SKU               string    `gorm:"size:100" json:"sku"`
	Barcode           string    `gorm:"size:100" json:"barcode"`
	StockQuantity     int       `json:"stockQuantity"`     // camelCase
	LowStockThreshold int       `json:"lowStockThreshold"` // camelCase
	Weight            *float64  `json:"weight"`
	IsActive          bool      `json:"isActive"`                  // camelCase
	IsFeatured        bool      `json:"isFeatured"`                // camelCase
	MetaTitle         *string   `gorm:"size:255" json:"metaTitle"` // camelCase
	MetaDescription   *string   `json:"metaDescription"`           // camelCase
	CreatedAt         time.Time `json:"createdAt"`                 // camelCase
	UpdatedAt         time.Time `json:"updatedAt"`                 // camelCase
}

// TableName sets the table name for Product
func (p *Product) TableName() string {
	return "products"
}

// BeforeCreate hook to generate UUID before saving
func (p *Product) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.NewString()
	}
	return nil
}
