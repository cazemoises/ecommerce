package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents the user entity
type User struct {
	ID           string    `gorm:"type:text;primaryKey" json:"id"`
	Name         string    `gorm:"size:255" json:"name"`
	Email        string    `gorm:"size:255;uniqueIndex" json:"email"`
	PasswordHash string    `gorm:"size:255" json:"-"`                      // Never expose password hash
	Role         string    `gorm:"size:50;default:'customer'" json:"role"` // 'customer' or 'seller'
	AvatarURL    *string   `gorm:"size:255" json:"avatarUrl"`              // camelCase for TS alignment
	IsActive     bool      `gorm:"default:true" json:"isActive"`           // camelCase
	CreatedAt    time.Time `json:"createdAt"`                              // camelCase
	UpdatedAt    time.Time `json:"updatedAt"`                              // camelCase
}

// TableName sets the table name for User
func (u *User) TableName() string {
	return "users"
}

// BeforeCreate hook to generate UUID before saving
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = uuid.NewString()
	}
	return nil
}

// UserResponse is the DTO returned to frontend (no sensitive data)
type UserResponse struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	AvatarURL *string   `json:"avatarUrl"` // camelCase
	CreatedAt time.Time `json:"createdAt"` // camelCase
}

// ToResponse converts User to UserResponse
func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		Role:      u.Role,
		AvatarURL: u.AvatarURL,
		CreatedAt: u.CreatedAt,
	}
}
