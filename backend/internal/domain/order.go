package domain

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Order represents an order entity
type Order struct {
	ID              string           `gorm:"type:text;primaryKey" json:"id"`
	UserID          string           `gorm:"type:text" json:"userId"`                          // camelCase
	OrderNumber     string           `gorm:"size:50;uniqueIndex" json:"orderNumber"`           // camelCase + orderNumber for TS
	Status          string           `gorm:"size:50;default:'pending'" json:"status"`          // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
	TotalAmount     float64          `gorm:"type:real" json:"total"`                           // 'total' per TS
	ShippingFee     float64          `gorm:"type:real;default:0" json:"shippingFee"`           // camelCase
	DiscountAmount  float64          `gorm:"type:real;default:0" json:"discountAmount"`        // camelCase
	PaymentMethod   *string          `gorm:"size:100" json:"paymentMethod"`                    // camelCase
	ShippingAddress *ShippingAddress `gorm:"type:json;serializer:json" json:"shippingAddress"` // camelCase + json (SQLite)
	TrackingNumber  *string          `gorm:"size:100" json:"trackingNumber"`                   // camelCase
	Notes           *string          `json:"notes"`
	Items           []OrderItem      `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE" json:"items"`
	CreatedAt       time.Time        `json:"createdAt"` // camelCase
	UpdatedAt       time.Time        `json:"updatedAt"` // camelCase
}

// TableName sets the table name for Order
func (o *Order) TableName() string {
	return "orders"
}

// BeforeCreate hook to generate UUID and OrderNumber before saving
func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == "" {
		o.ID = uuid.NewString()
	}
	if o.OrderNumber == "" {
		// Generate order number: ORD-RANDOMID
		o.OrderNumber = "ORD-" + uuid.NewString()[:8]
	}
	return nil
}

// ShippingAddress holds address information in JSON (SQLite compatible)
type ShippingAddress struct {
	Street       string `json:"street"`
	Number       string `json:"number"`
	Complement   string `json:"complement,omitempty"`
	Neighborhood string `json:"neighborhood"`
	City         string `json:"city"`
	State        string `json:"state"`
	PostalCode   string `json:"postalCode"` // camelCase
	Country      string `json:"country,omitempty"`
	Recipient    string `json:"recipient"`
	Phone        string `json:"phone,omitempty"`
}

// Scan implements sql.Scanner interface
func (sa *ShippingAddress) Scan(value interface{}) error {
	bytes, _ := value.([]byte)
	return json.Unmarshal(bytes, &sa)
}

// Value implements driver.Valuer interface
func (sa ShippingAddress) Value() (driver.Value, error) {
	return json.Marshal(sa)
}

// OrderItem represents items in an order
type OrderItem struct {
	ID          string    `gorm:"type:text;primaryKey" json:"id"`
	OrderID     string    `gorm:"type:text" json:"orderId"`   // camelCase
	ProductID   string    `gorm:"type:text" json:"productId"` // camelCase
	Quantity    int       `json:"quantity"`
	PriceAtTime float64   `gorm:"type:real" json:"priceAtTime"` // camelCase
	Color       *string   `gorm:"size:100" json:"color,omitempty"`
	Size        *string   `gorm:"size:50" json:"size,omitempty"`
	Product     *Product  `gorm:"foreignKey:ProductID;constraint:OnDelete:RESTRICT" json:"product,omitempty"`
	CreatedAt   time.Time `json:"createdAt"` // camelCase
}

// TableName sets the table name for OrderItem
func (oi *OrderItem) TableName() string {
	return "order_items"
}

// BeforeCreate hook to generate UUID before saving
func (oi *OrderItem) BeforeCreate(tx *gorm.DB) error {
	if oi.ID == "" {
		oi.ID = uuid.NewString()
	}
	return nil
}

// OrderResponse is the DTO returned to frontend
type OrderResponse struct {
	ID              string              `json:"id"`
	UserID          string              `json:"userId"`      // camelCase
	OrderNumber     string              `json:"orderNumber"` // camelCase
	Status          string              `json:"status"`
	Total           float64             `json:"total"`           // Match TS 'total' field
	ShippingFee     float64             `json:"shippingFee"`     // camelCase
	DiscountAmount  float64             `json:"discountAmount"`  // camelCase
	PaymentMethod   *string             `json:"paymentMethod"`   // camelCase
	ShippingAddress *ShippingAddress    `json:"shippingAddress"` // camelCase
	TrackingNumber  *string             `json:"trackingNumber"`  // camelCase
	Items           []OrderItemResponse `json:"items"`
	CreatedAt       time.Time           `json:"createdAt"` // camelCase
}

// OrderItemResponse is the DTO for order items
type OrderItemResponse struct {
	ID          string  `json:"id"`
	ProductID   string  `json:"productId"`             // camelCase
	ProductName string  `json:"productName,omitempty"` // camelCase
	Quantity    int     `json:"quantity"`
	PriceAtTime float64 `json:"priceAtTime"` // camelCase
	Color       *string `json:"color,omitempty"`
	Size        *string `json:"size,omitempty"`
}

// ToResponse converts Order to OrderResponse
func (o *Order) ToResponse() *OrderResponse {
	items := make([]OrderItemResponse, len(o.Items))
	for i, item := range o.Items {
		items[i] = OrderItemResponse{
			ID:          item.ID,
			ProductID:   item.ProductID,
			ProductName: item.Product.Name,
			Quantity:    item.Quantity,
			PriceAtTime: item.PriceAtTime,
			Color:       item.Color,
			Size:        item.Size,
		}
	}

	return &OrderResponse{
		ID:              o.ID,
		UserID:          o.UserID,
		OrderNumber:     o.OrderNumber,
		Status:          o.Status,
		Total:           o.TotalAmount, // Map to 'total' per TS
		ShippingFee:     o.ShippingFee,
		DiscountAmount:  o.DiscountAmount,
		PaymentMethod:   o.PaymentMethod,
		ShippingAddress: o.ShippingAddress,
		TrackingNumber:  o.TrackingNumber,
		Items:           items,
		CreatedAt:       o.CreatedAt,
	}
}
