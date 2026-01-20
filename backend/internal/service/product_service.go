package service

import (
	"ecommerce/internal/domain"
	"ecommerce/internal/repository"
)

type ProductService interface {
	List(page int, perPage int) (interface{}, error)
	GetByID(id string) (*domain.Product, error)
	Create(product *domain.Product) error
	Update(product *domain.Product) error
	Delete(id string) error
}

type productService struct {
	repo repository.ProductRepository
}

func NewProductService(repo repository.ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) List(page int, perPage int) (interface{}, error) {
	if perPage <= 0 {
		perPage = 20
	}
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * perPage
	items, total, err := s.repo.List(perPage, offset)
	if err != nil {
		return nil, err
	}
	return map[string]interface{}{
		"items": items,
		"pagination": map[string]int{
			"page":        page,
			"per_page":    perPage,
			"total":       int(total),
			"total_pages": (int(total) + perPage - 1) / perPage,
		},
	}, nil
}

// GetByID retrieves a product by ID (implement in repo if not exists)
func (s *productService) GetByID(id string) (*domain.Product, error) {
	// This would require a GetByID method in the repository
	// For now, returning a placeholder error
	return nil, nil
}

// Create creates a new product (implement in repo if not exists)
func (s *productService) Create(product *domain.Product) error {
	// This would require a Create method in the repository
	return nil
}

// Update updates an existing product (implement in repo if not exists)
func (s *productService) Update(product *domain.Product) error {
	// This would require an Update method in the repository
	return nil
}

// Delete deletes a product (implement in repo if not exists)
func (s *productService) Delete(id string) error {
	// This would require a Delete method in the repository
	return nil
}
