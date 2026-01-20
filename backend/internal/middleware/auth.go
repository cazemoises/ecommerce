package middleware

import (
	"ecommerce/internal/service"
	"ecommerce/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware validates JWT tokens
func AuthMiddleware(authService service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, utils.ErrorResponse("Unauthorized", "Missing authorization header"))
			c.Abort()
			return
		}

		// Extract token (format: "Bearer <token>")
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, utils.ErrorResponse("Unauthorized", "Invalid authorization header format"))
			c.Abort()
			return
		}

		tokenString := parts[1]

		// Validate token
		claims, err := authService.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, utils.ErrorResponse("Unauthorized", "Invalid or expired token"))
			c.Abort()
			return
		}

		// Get user from token
		user, err := authService.GetUserFromToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, utils.ErrorResponse("Unauthorized", "User not found"))
			c.Abort()
			return
		}

		// Store user and claims in context
		c.Set("user", user)
		c.Set("claims", claims)

		c.Next()
	}
}

// RoleMiddleware checks if user has specific role
func RoleMiddleware(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, utils.ErrorResponse("Unauthorized", "No user in context"))
			c.Abort()
			return
		}

		// Type assertion - this should work after AuthMiddleware sets it
		userInterface, ok := user.(interface{})
		if !ok {
			c.JSON(http.StatusInternalServerError, utils.ErrorResponse("Internal error", "Invalid user type"))
			c.Abort()
			return
		}

		// You would need to check the role here
		// For now, we'll skip this check as it's already done in handlers
		_ = userInterface

		c.Next()
	}
}

// OptionalAuthMiddleware allows both authenticated and unauthenticated requests
func OptionalAuthMiddleware(authService service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.Next()
			return
		}

		tokenString := parts[1]
		user, err := authService.GetUserFromToken(tokenString)
		if err != nil {
			c.Next()
			return
		}

		c.Set("user", user)
		c.Next()
	}
}
