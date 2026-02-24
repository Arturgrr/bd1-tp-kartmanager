package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (api *API) handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "version": "v1"})
}
