package repository

import (
	"ecommerce/internal/domain"

	"gorm.io/gorm"
)

// UserRepository defines user data operations
type UserRepository interface {
	Create(user *domain.User) error
	GetByEmail(email string) (*domain.User, error)
	GetByID(id string) (*domain.User, error)
	Update(user *domain.User) error
	Delete(id string) error
}

type userRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

// Create inserts a new user into the database
func (r *userRepository) Create(user *domain.User) error {
	result := r.db.Create(user)
	return result.Error
}

// GetByEmail retrieves a user by email
func (r *userRepository) GetByEmail(email string) (*domain.User, error) {
	var user domain.User
	result := r.db.Where("email = ?", email).First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return &user, nil
}

// GetByID retrieves a user by ID
func (r *userRepository) GetByID(id string) (*domain.User, error) {
	var user domain.User
	result := r.db.Where("id = ?", id).First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return &user, nil
}

// Update updates an existing user
func (r *userRepository) Update(user *domain.User) error {
	result := r.db.Save(user)
	return result.Error
}

// Delete deletes a user by ID
func (r *userRepository) Delete(id string) error {
	result := r.db.Delete(&domain.User{}, "id = ?", id)
	return result.Error
}
