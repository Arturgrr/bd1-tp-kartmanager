package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// handleHealth godoc
//
//	@Summary	Health check
//	@Tags		health
//	@Produce	json
//	@Success	200	{object}	map[string]string	"status, version"
//	@Router		/health [get]
func (api *API) handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "version": "v1"})
}
