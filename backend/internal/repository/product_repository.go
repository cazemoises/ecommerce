package repository

import (
	"ecommerce/internal/domain"

	"gorm.io/gorm"
)

type ProductRepository interface {
	List(limit int, offset int) ([]domain.Product, int64, error)
	FindByID(id string) (*domain.Product, error)
	Create(product *domain.Product) error
	Update(product *domain.Product) error
	Delete(id string) error
	FindBySellerID(sellerID string, limit int, offset int) ([]domain.Product, int64, error)
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) List(limit int, offset int) ([]domain.Product, int64, error) {
	var products []domain.Product
	var total int64

	r.db.Model(&domain.Product{}).Count(&total)
	res := r.db.Limit(limit).Offset(offset).Order("created_at DESC").Find(&products)
	return products, total, res.Error
}

// FindByID retrieves a product by ID
func (r *productRepository) FindByID(id string) (*domain.Product, error) {
	var product domain.Product
	err := r.db.Where("id = ?", id).First(&product).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &product, nil
}

// Create saves a new product
func (r *productRepository) Create(product *domain.Product) error {
	return r.db.Create(product).Error
}

// Update saves changes to an existing product
func (r *productRepository) Update(product *domain.Product) error {
	return r.db.Save(product).Error
}

// Delete removes a product
func (r *productRepository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&domain.Product{}).Error
}

// FindBySellerID retrieves products by seller ID
func (r *productRepository) FindBySellerID(sellerID string, limit int, offset int) ([]domain.Product, int64, error) {
	var products []domain.Product
	var total int64

	r.db.Where("seller_id = ?", sellerID).Model(&domain.Product{}).Count(&total)
	err := r.db.Where("seller_id = ?", sellerID).Limit(limit).Offset(offset).Order("created_at DESC").Find(&products).Error
	return products, total, err
}
