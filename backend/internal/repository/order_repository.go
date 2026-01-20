package repository

import (
	"ecommerce/internal/domain"

	"gorm.io/gorm"
)

// OrderRepository defines order data operations
type OrderRepository interface {
	CreateOrderWithItems(order *domain.Order, items []domain.OrderItem) error
	GetByID(id string) (*domain.Order, error)
	GetByUserID(userID string, limit int, offset int) ([]domain.Order, int64, error)
	UpdateStatus(orderID string, status string) error
	GetSellerOrders(sellerID string, limit int, offset int) ([]domain.Order, int64, error)
}

type orderRepository struct {
	db *gorm.DB
}

// NewOrderRepository creates a new order repository
func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

// CreateOrderWithItems creates an order with items in a single transaction
func (r *orderRepository) CreateOrderWithItems(order *domain.Order, items []domain.OrderItem) error {
	// Use transaction to ensure data consistency
	tx := r.db.Begin()

	// Create order
	if err := tx.Create(order).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Set order ID for all items
	for i := range items {
		items[i].OrderID = order.ID
	}

	// Create order items
	if err := tx.CreateInBatches(items, 100).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Commit transaction
	return tx.Commit().Error
}

// GetByID retrieves an order by ID with all items and product details
func (r *orderRepository) GetByID(id string) (*domain.Order, error) {
	var order domain.Order
	result := r.db.
		Preload("Items").
		Preload("Items.Product").
		Where("id = ?", id).
		First(&order)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return &order, nil
}

// GetByUserID retrieves all orders for a user with pagination
func (r *orderRepository) GetByUserID(userID string, limit int, offset int) ([]domain.Order, int64, error) {
	var orders []domain.Order
	var total int64

	// Count total orders for user
	if err := r.db.Model(&domain.Order{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Fetch orders with items
	result := r.db.
		Preload("Items").
		Preload("Items.Product").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&orders)

	return orders, total, result.Error
}

// UpdateStatus updates the status of an order
func (r *orderRepository) UpdateStatus(orderID string, status string) error {
	result := r.db.Model(&domain.Order{}).Where("id = ?", orderID).Update("status", status)
	return result.Error
}

// GetSellerOrders retrieves orders containing products from a specific seller
func (r *orderRepository) GetSellerOrders(sellerID string, limit int, offset int) ([]domain.Order, int64, error) {
	var orders []domain.Order
	var total int64

	// Count total orders where seller has products
	if err := r.db.Model(&domain.Order{}).
		Joins("INNER JOIN order_items ON order_items.order_id = orders.id").
		Joins("INNER JOIN products ON products.id = order_items.product_id").
		Where("products.seller_id = ?", sellerID).
		Distinct("orders.id").
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Fetch orders
	result := r.db.
		Preload("Items").
		Preload("Items.Product").
		Joins("INNER JOIN order_items ON order_items.order_id = orders.id").
		Joins("INNER JOIN products ON products.id = order_items.product_id").
		Where("products.seller_id = ?", sellerID).
		Distinct("orders.id").
		Order("orders.created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&orders)

	return orders, total, result.Error
}
