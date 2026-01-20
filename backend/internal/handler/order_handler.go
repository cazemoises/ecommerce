package handler

import (
	"ecommerce/internal/domain"
	"ecommerce/internal/service"
	"ecommerce/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// OrderHandler handles order endpoints
type OrderHandler struct {
	orderService service.OrderService
}

// NewOrderHandler creates a new order handler
func NewOrderHandler(orderService service.OrderService) *OrderHandler {
	return &OrderHandler{orderService: orderService}
}

// CreateOrder creates a new order from cart items
// POST /api/orders (Protected)
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	// Get user from context (set by auth middleware)
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, utils.ErrorResponse("Unauthorized", "No user in context"))
		return
	}

	userData, ok := user.(*domain.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse("Internal error", "Invalid user type"))
		return
	}

	var req domain.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.ErrorResponse("Invalid request", err.Error()))
		return
	}

	order, err := h.orderService.CreateOrder(userData.ID, &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.ErrorResponse("Failed to create order", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, utils.SuccessResponse(order, "Order created successfully"))
}

// GetOrder retrieves a specific order
// GET /api/orders/:id (Protected)
func (h *OrderHandler) GetOrder(c *gin.Context) {
	orderID := c.Param("id")

	order, err := h.orderService.GetOrder(orderID)
	if err != nil {
		c.JSON(http.StatusNotFound, utils.ErrorResponse("Order not found", err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.SuccessResponse(order, "Order retrieved"))
}

// GetMyOrders retrieves all orders for the current user
// GET /api/orders/my-orders (Protected)
func (h *OrderHandler) GetMyOrders(c *gin.Context) {
	// Get user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, utils.ErrorResponse("Unauthorized", "No user in context"))
		return
	}

	userData, ok := user.(*domain.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse("Internal error", "Invalid user type"))
		return
	}

	// Get pagination parameters
	limit := 10
	offset := 0

	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil {
			limit = parsed
		}
	}

	if o := c.Query("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil {
			offset = parsed
		}
	}

	orders, total, err := h.orderService.GetUserOrders(userData.ID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse("Failed to fetch orders", err.Error()))
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Orders retrieved",
		"data": gin.H{
			"orders": orders,
			"total":  total,
			"limit":  limit,
			"offset": offset,
		},
	})
}

// GetSellerOrders retrieves orders for seller products
// GET /api/seller/orders (Protected - Seller only)
func (h *OrderHandler) GetSellerOrders(c *gin.Context) {
	// Get user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, utils.ErrorResponse("Unauthorized", "No user in context"))
		return
	}

	userData, ok := user.(*domain.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse("Internal error", "Invalid user type"))
		return
	}

	// Verify seller role
	if userData.Role != "seller" {
		c.JSON(http.StatusForbidden, utils.ErrorResponse("Forbidden", "Only sellers can access this endpoint"))
		return
	}

	// Get pagination parameters
	limit := 10
	offset := 0

	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil {
			limit = parsed
		}
	}

	if o := c.Query("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil {
			offset = parsed
		}
	}

	orders, total, err := h.orderService.GetSellerOrders(userData.ID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse("Failed to fetch orders", err.Error()))
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Seller orders retrieved",
		"data": gin.H{
			"orders": orders,
			"total":  total,
			"limit":  limit,
			"offset": offset,
		},
	})
}

// GetSellerAnalytics retrieves analytics for seller
// GET /api/seller/analytics (Protected - Seller only)
func (h *OrderHandler) GetSellerAnalytics(c *gin.Context) {
	// Get user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, utils.ErrorResponse("Unauthorized", "No user in context"))
		return
	}

	userData, ok := user.(*domain.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse("Internal error", "Invalid user type"))
		return
	}

	// Verify seller role
	if userData.Role != "seller" {
		c.JSON(http.StatusForbidden, utils.ErrorResponse("Forbidden", "Only sellers can access this endpoint"))
		return
	}

	analytics, err := h.orderService.GetSellerAnalytics(userData.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse("Failed to fetch analytics", err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.SuccessResponse(analytics, "Analytics retrieved"))
}
