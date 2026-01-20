package service

import (
	"ecommerce/internal/domain"
	"ecommerce/internal/repository"
	"errors"
)

// OrderService defines order operations
type OrderService interface {
	CreateOrder(userID string, req *domain.CreateOrderRequest) (*domain.OrderResponse, error)
	GetOrder(orderID string) (*domain.OrderResponse, error)
	GetUserOrders(userID string, limit int, offset int) ([]domain.OrderResponse, int64, error)
	UpdateOrderStatus(orderID string, status string) error
	GetSellerOrders(sellerID string, limit int, offset int) ([]domain.OrderResponse, int64, error)
	GetSellerAnalytics(sellerID string) (*domain.AnalyticsResponse, error)
}

type orderService struct {
	orderRepo   repository.OrderRepository
	productRepo repository.ProductRepository
}

// NewOrderService creates a new order service
func NewOrderService(orderRepo repository.OrderRepository, productRepo repository.ProductRepository) OrderService {
	return &orderService{
		orderRepo:   orderRepo,
		productRepo: productRepo,
	}
}

// CreateOrder creates a new order from cart items
func (s *orderService) CreateOrder(userID string, req *domain.CreateOrderRequest) (*domain.OrderResponse, error) {
	if len(req.Items) == 0 {
		return nil, errors.New("order must have at least one item")
	}

	// Calculate total and create order items
	var totalAmount float64
	orderItems := make([]domain.OrderItem, 0)

	for _, item := range req.Items {
		// CRITICAL: Fetch actual product price from database
		// Never trust prices sent from frontend
		product, err := s.productRepo.FindByID(item.ProductID)
		if err != nil {
			return nil, err
		}
		if product == nil {
			return nil, errors.New("product not found: " + item.ProductID)
		}

		// Verify product is available
		if !product.IsActive {
			return nil, errors.New("product is not available: " + product.Name)
		}

		// Verify stock
		if product.StockQuantity < item.Quantity {
			return nil, errors.New("insufficient stock for: " + product.Name)
		}

		orderItem := domain.OrderItem{
			ProductID:   item.ProductID,
			Quantity:    item.Quantity,
			PriceAtTime: product.Price, // Use actual price from database
			Color:       item.Color,
			Size:        item.Size,
		}
		orderItems = append(orderItems, orderItem)
		totalAmount += product.Price * float64(item.Quantity)
	}

	// Create order with calculated total
	order := &domain.Order{
		UserID:          userID,
		Status:          "pending",
		TotalAmount:     totalAmount,
		ShippingAddress: &req.ShippingAddress,
		PaymentMethod:   &req.PaymentMethod,
	}

	// Save order with items in transaction
	if err := s.orderRepo.CreateOrderWithItems(order, orderItems); err != nil {
		return nil, err
	}

	// Fetch the created order with full details
	createdOrder, err := s.orderRepo.GetByID(order.ID)
	if err != nil {
		return nil, err
	}

	return createdOrder.ToResponse(), nil
}

// GetOrder retrieves an order by ID
func (s *orderService) GetOrder(orderID string) (*domain.OrderResponse, error) {
	order, err := s.orderRepo.GetByID(orderID)
	if err != nil {
		return nil, err
	}

	if order == nil {
		return nil, errors.New("order not found")
	}

	return order.ToResponse(), nil
}

// GetUserOrders retrieves all orders for a user
func (s *orderService) GetUserOrders(userID string, limit int, offset int) ([]domain.OrderResponse, int64, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	orders, total, err := s.orderRepo.GetByUserID(userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]domain.OrderResponse, len(orders))
	for i, order := range orders {
		responses[i] = *order.ToResponse()
	}

	return responses, total, nil
}

// UpdateOrderStatus updates the status of an order
func (s *orderService) UpdateOrderStatus(orderID string, status string) error {
	validStatuses := map[string]bool{
		"pending":   true,
		"confirmed": true,
		"shipped":   true,
		"delivered": true,
		"cancelled": true,
	}

	if !validStatuses[status] {
		return errors.New("invalid order status")
	}

	return s.orderRepo.UpdateStatus(orderID, status)
}

// GetSellerOrders retrieves orders for a seller
func (s *orderService) GetSellerOrders(sellerID string, limit int, offset int) ([]domain.OrderResponse, int64, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	orders, total, err := s.orderRepo.GetSellerOrders(sellerID, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]domain.OrderResponse, len(orders))
	for i, order := range orders {
		responses[i] = *order.ToResponse()
	}

	return responses, total, nil
}

// GetSellerAnalytics retrieves analytics for a seller
func (s *orderService) GetSellerAnalytics(sellerID string) (*domain.AnalyticsResponse, error) {
	// Fetch seller orders
	orders, _, err := s.orderRepo.GetSellerOrders(sellerID, 1000, 0)
	if err != nil {
		return nil, err
	}

	totalOrders := int64(len(orders))
	totalRevenue := 0.0

	for _, order := range orders {
		totalRevenue += order.TotalAmount
	}

	avgOrder := 0.0
	if totalOrders > 0 {
		avgOrder = totalRevenue / float64(totalOrders)
	}

	return &domain.AnalyticsResponse{
		TotalOrders:       totalOrders,
		TotalRevenue:      totalRevenue,
		AverageOrderValue: avgOrder,
		TotalProducts:     0, // Should fetch from product repo
		TotalViews:        0, // Should be tracked separately
		ConversionRate:    0.0,
	}, nil
}
