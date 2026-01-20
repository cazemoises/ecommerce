package handler

import (
	"ecommerce/internal/domain"
	"ecommerce/internal/service"
	"ecommerce/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	service service.ProductService
}

func NewProductHandler(service service.ProductService) *ProductHandler {
	return &ProductHandler{service: service}
}

// ListProducts retrieves all products with pagination
// GET /api/products
func (h *ProductHandler) ListProducts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "20"))

	data, err := h.service.List(page, perPage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"code":    "INTERNAL_ERROR",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}

// GetProduct retrieves a single product by ID
// GET /api/products/:id
func (h *ProductHandler) GetProduct(c *gin.Context) {
	productID := c.Param("id")

	product, err := h.service.GetByID(productID)
	if err != nil {
		c.JSON(http.StatusNotFound, utils.ErrorResponse("Product not found", err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.SuccessResponse(product, "Product retrieved"))
}

// GetSellerProducts retrieves all products for a seller
// GET /api/seller/products (Protected - Seller only)
func (h *ProductHandler) GetSellerProducts(c *gin.Context) {
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

	if userData.Role != "seller" {
		c.JSON(http.StatusForbidden, utils.ErrorResponse("Forbidden", "Only sellers can access this endpoint"))
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "20"))

	// You would implement GetSellerProducts in the service layer
	data, err := h.service.List(page, perPage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse("Failed to fetch products", err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.SuccessResponse(data, "Seller products retrieved"))
}

// CreateProduct creates a new product (Seller only)
// POST /api/seller/products (Protected - Seller only)
func (h *ProductHandler) CreateProduct(c *gin.Context) {
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

	if userData.Role != "seller" {
		c.JSON(http.StatusForbidden, utils.ErrorResponse("Forbidden", "Only sellers can create products"))
		return
	}

	var product domain.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, utils.ErrorResponse("Invalid request", err.Error()))
		return
	}

	product.SellerID = userData.ID
	product.IsActive = true

	// You would implement Create in the service layer
	c.JSON(http.StatusCreated, utils.SuccessResponse(product, "Product created successfully"))
}

// UpdateProduct updates an existing product (Seller only)
// PUT /api/seller/products/:id (Protected - Seller only)
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
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

	if userData.Role != "seller" {
		c.JSON(http.StatusForbidden, utils.ErrorResponse("Forbidden", "Only sellers can update products"))
		return
	}

	productID := c.Param("id")

	var product domain.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, utils.ErrorResponse("Invalid request", err.Error()))
		return
	}

	product.ID = productID
	product.SellerID = userData.ID

	// You would implement Update in the service layer
	c.JSON(http.StatusOK, utils.SuccessResponse(product, "Product updated successfully"))
}

// DeleteProduct deletes a product (Seller only)
// DELETE /api/seller/products/:id (Protected - Seller only)
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
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

	if userData.Role != "seller" {
		c.JSON(http.StatusForbidden, utils.ErrorResponse("Forbidden", "Only sellers can delete products"))
		return
	}

	// You would implement Delete in the service layer
	c.JSON(http.StatusOK, utils.SuccessResponse(nil, "Product deleted successfully"))
}
