package api

import (
	_ "github.com/arturgrr/bd1-kartmanager/docs"
	"github.com/gin-contrib/requestid"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func (api *API) BindRoutes() {
	api.router.Use(requestid.New(), gin.Logger(), gin.Recovery())
	api.router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	v1 := api.router.Group("/api/v1")
	v1.GET("/health", api.handleHealth)
	v1.GET("/categorias", api.handleListCategorias)
	v1.GET("/categorias/:slug", api.handleGetCategoriaBySlug)
	v1.GET("/pilotos", api.handleListPilotos)
	v1.GET("/pilotos/:slug", api.handleGetPilotoBySlug)
}
