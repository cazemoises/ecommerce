package handler

import (
	"ecommerce/internal/domain"
	"ecommerce/internal/service"
	"ecommerce/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	authService service.AuthService
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// Login handles user login
// POST /api/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req domain.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.ErrorResponse("Invalid request", err.Error()))
		return
	}

	resp, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.ErrorResponse("Authentication failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.SuccessResponse(resp, "Login successful"))
}

// Register handles user registration
// POST /api/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req domain.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.ErrorResponse("Invalid request", err.Error()))
		return
	}

	resp, err := h.authService.Register(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.ErrorResponse("Registration failed", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, utils.SuccessResponse(resp, "Registration successful"))
}

// GetMe retrieves the current authenticated user
// GET /api/auth/me (Protected)
func (h *AuthHandler) GetMe(c *gin.Context) {
	// User is extracted from context by middleware
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

	c.JSON(http.StatusOK, utils.SuccessResponse(userData.ToResponse(), "User retrieved"))
}
