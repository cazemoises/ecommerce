package domain

// LoginRequest is the request body for login
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// RegisterRequest is the request body for registration
type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginResponse is the response after successful login
type LoginResponse struct {
	Token string        `json:"token"`
	User  *UserResponse `json:"user"`
}

// CreateOrderRequest is the request body for creating an order
type CreateOrderRequest struct {
	Items           []OrderItemInput `json:"items" binding:"required,min=1"`
	ShippingAddress ShippingAddress  `json:"shipping_address" binding:"required"`
	PaymentMethod   string           `json:"payment_method" binding:"required"`
}

// OrderItemInput represents a cart item when creating an order
type OrderItemInput struct {
	ProductID string  `json:"product_id" binding:"required,uuid"`
	Quantity  int     `json:"quantity" binding:"required,min=1"`
	Color     *string `json:"color"`
	Size      *string `json:"size"`
}

// AnalyticsRequest for seller analytics
type AnalyticsRequest struct {
	StartDate string `form:"start_date"` // RFC3339 format
	EndDate   string `form:"end_date"`   // RFC3339 format
}

// AnalyticsResponse for seller analytics
type AnalyticsResponse struct {
	TotalOrders       int64   `json:"total_orders"`
	TotalRevenue      float64 `json:"total_revenue"`
	AverageOrderValue float64 `json:"average_order_value"`
	TotalProducts     int64   `json:"total_products"`
	TotalViews        int64   `json:"total_views"`
	ConversionRate    float64 `json:"conversion_rate"`
}
