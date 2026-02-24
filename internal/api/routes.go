package api

import (
	"github.com/gin-contrib/requestid"
	"github.com/gin-gonic/gin"
)

func (api *API) BindRoutes() {
	api.router.Use(requestid.New(), gin.Logger(), gin.Recovery())
	v1 := api.router.Group("/api/v1")
	v1.GET("/health", api.handleHealth)
}
