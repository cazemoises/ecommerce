package main

import (
	"log"
	"os"

	"ecommerce/internal/config"
	"ecommerce/internal/domain" // <--- ADICIONADO: Necessário para acessar as Structs
	"ecommerce/internal/handler"
	"ecommerce/internal/middleware"
	"ecommerce/internal/repository"
	"ecommerce/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load env
	config.LoadEnv()

	// Setup DB
	db, err := config.InitDB()
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// ============================================================
	// ADICIONADO: Auto Migração (Cria as tabelas no Banco)
	// ============================================================
	log.Println("Running database migrations...")
	err = db.AutoMigrate(
		&domain.User{},
		&domain.Product{},
		&domain.Order{},
		&domain.OrderItem{},
	)
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	log.Println("Database migration completed successfully!")
	// ============================================================

	// ===== REPOSITORIES =====
	productRepo := repository.NewProductRepository(db)
	userRepo := repository.NewUserRepository(db)
	orderRepo := repository.NewOrderRepository(db)

	// ===== SERVICES =====
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key" // Fallback for development
	}

	authService := service.NewAuthService(userRepo, jwtSecret)
	productService := service.NewProductService(productRepo)
	orderService := service.NewOrderService(orderRepo, productRepo)

	// ===== HANDLERS =====
	authHandler := handler.NewAuthHandler(authService)
	productHandler := handler.NewProductHandler(productService)
	orderHandler := handler.NewOrderHandler(orderService)

	// ===== ROUTER =====
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	api := r.Group("/api")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"success": true, "message": "OK"})
		})

		// ===== PUBLIC ROUTES =====
		products := api.Group("/products")
		{
			products.GET("", productHandler.ListProducts)
			products.GET("/:id", productHandler.GetProduct)
		}

		// ===== AUTH ROUTES =====
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/register", authHandler.Register)
			auth.GET("/me", middleware.AuthMiddleware(authService), authHandler.GetMe)
		}

		// ===== PROTECTED CUSTOMER ROUTES =====
		customer := api.Group("/orders")
		customer.Use(middleware.AuthMiddleware(authService))
		{
			customer.POST("", orderHandler.CreateOrder)
			customer.GET("/my-orders", orderHandler.GetMyOrders)
			customer.GET("/:id", orderHandler.GetOrder)
		}

		// ===== SELLER ROUTES =====
		seller := api.Group("/seller")
		seller.Use(middleware.AuthMiddleware(authService))
		{
			seller.GET("/analytics", orderHandler.GetSellerAnalytics)
			seller.GET("/orders", orderHandler.GetSellerOrders)
			seller.GET("/products", productHandler.GetSellerProducts)
			seller.POST("/products", productHandler.CreateProduct)
			seller.PUT("/products/:id", productHandler.UpdateProduct)
			seller.DELETE("/products/:id", productHandler.DeleteProduct)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
