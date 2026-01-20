package utils

// SuccessResponse creates a standard success response
func SuccessResponse(data interface{}, message string) map[string]interface{} {
	return map[string]interface{}{
		"success": true,
		"message": message,
		"data":    data,
	}
}

// ErrorResponse creates a standard error response
func ErrorResponse(message string, details string) map[string]interface{} {
	return map[string]interface{}{
		"success": false,
		"message": message,
		"error":   details,
	}
}

// PaginatedResponse creates a paginated response
func PaginatedResponse(items interface{}, total int64, page int, perPage int) map[string]interface{} {
	totalPages := (int(total) + perPage - 1) / perPage
	return map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"items":       items,
			"total":       total,
			"page":        page,
			"per_page":    perPage,
			"total_pages": totalPages,
		},
	}
}
