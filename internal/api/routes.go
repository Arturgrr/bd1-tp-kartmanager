package api

import "github.com/gin-gonic/gin"

func (api *API) BindRoutes() {
	v1 := api.router.Group("/api/v1")
	v1.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "version": "v1"})
	})
}	