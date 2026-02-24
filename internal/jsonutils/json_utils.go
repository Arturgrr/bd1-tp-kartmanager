package jsonutils

import (
	"encoding/json"
	"fmt"
	"io"

	"github.com/arturgrr/bd1-kartmanager/internal/validator"
	"github.com/gin-gonic/gin"
)

func EncodeJSON[T any](c *gin.Context, statusCode int, data T) error {
	c.Header("Content-Type", "application/json; charset=utf-8")
	c.JSON(statusCode, data)
	return nil
}

func DecodeValidJSON[T validator.Validator](c *gin.Context) (T, map[string]string, error) {
	var data T
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		return data, map[string]string{"body": "failed to read body"}, fmt.Errorf("read body: %w", err)
	}
	if len(body) == 0 {
		return data, map[string]string{"body": "request body must be valid JSON and not empty"}, fmt.Errorf("empty body")
	}
	if err := json.Unmarshal(body, &data); err != nil {
		return data, map[string]string{"body": "request body must be valid JSON and not empty"}, fmt.Errorf("decode json: %w", err)
	}
	eval := data.Valid(c.Request.Context())
	if len(eval) > 0 {
		return data, eval, fmt.Errorf("invalid %T: %d problems", data, len(eval))
	}
	return data, nil, nil
}

func DecodeJSON[T any](c *gin.Context) (T, error) {
	var data T
	if err := c.ShouldBindJSON(&data); err != nil {
		return data, fmt.Errorf("decode json: %w", err)
	}
	return data, nil
}
