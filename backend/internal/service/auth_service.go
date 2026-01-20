package service

import (
	"ecommerce/internal/domain"
	"ecommerce/internal/repository"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// AuthService defines authentication operations
type AuthService interface {
	Login(email, password string) (*domain.LoginResponse, error)
	Register(req *domain.RegisterRequest) (*domain.LoginResponse, error)
	ValidateToken(tokenString string) (*jwt.RegisteredClaims, error)
	GetUserFromToken(tokenString string) (*domain.User, error)
}

type authService struct {
	userRepo  repository.UserRepository
	jwtSecret string
}

// NewAuthService creates a new auth service
func NewAuthService(userRepo repository.UserRepository, jwtSecret string) AuthService {
	return &authService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

// Login authenticates a user and returns JWT token
func (s *authService) Login(email, password string) (*domain.LoginResponse, error) {
	// Find user by email
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, errors.New("invalid credentials")
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Generate JWT token
	token, err := s.generateToken(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	return &domain.LoginResponse{
		Token: token,
		User:  user.ToResponse(),
	}, nil
}

// Register creates a new user account
func (s *authService) Register(req *domain.RegisterRequest) (*domain.LoginResponse, error) {
	// Check if user already exists
	existingUser, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		return nil, err
	}

	if existingUser != nil {
		return nil, errors.New("email already in use")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create new user
	user := &domain.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Role:         "customer",
		IsActive:     true,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	// Generate JWT token
	token, err := s.generateToken(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	return &domain.LoginResponse{
		Token: token,
		User:  user.ToResponse(),
	}, nil
}

// ValidateToken validates a JWT token
func (s *authService) ValidateToken(tokenString string) (*jwt.RegisteredClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.jwtSecret), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*jwt.RegisteredClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

// GetUserFromToken retrieves user from JWT token
func (s *authService) GetUserFromToken(tokenString string) (*domain.User, error) {
	claims, err := s.ValidateToken(tokenString)
	if err != nil {
		return nil, err
	}

	// User ID is in the Subject claim
	user, err := s.userRepo.GetByID(claims.Subject)
	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, errors.New("user not found")
	}

	return user, nil
}

// generateToken creates a JWT token
func (s *authService) generateToken(userID, email, role string) (string, error) {
	claims := jwt.RegisteredClaims{
		Subject:   userID,
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		Issuer:    "ecommerce-api",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}
