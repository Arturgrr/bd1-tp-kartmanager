package api

import (
	_ "github.com/arturgrr/bd1-kartmanager/docs"
	"github.com/gin-contrib/requestid"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func (api *API) BindRoutes() {
	api.router.Use(requestid.New(), gin.Logger(), gin.Recovery())
	store := cookie.NewStore(api.sessionSecret)
	api.router.Use(sessions.Sessions("gpmanager_session", store))
	api.router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	v1 := api.router.Group("/api/v1")
	v1.GET("/health", api.handleHealth)
	v1.POST("/admin/login", api.handleLoginAdmin)
	v1.GET("/categorias", api.handleListCategorias)
	v1.GET("/categorias/:slug", api.handleGetCategoriaBySlug)
	v1.GET("/pilotos", api.handleListPilotos)
	v1.GET("/pilotos/:slug", api.handleGetPilotoBySlug)
	v1.GET("/equipes", api.handleListEquipes)
	v1.GET("/equipes/:slug", api.handleGetEquipeBySlug)
	v1.GET("/corridas", api.handleListCorridas)
	v1.GET("/corridas/:slug", api.handleGetCorridaBySlug)
	v1.GET("/corridas/completed", api.handleListCorridasCompleted)
	v1.GET("/corridas/upcoming", api.handleListCorridasUpcoming)
	v1.GET("/corridas/:slug/resultados", api.handleListResultadosByCorrida)
	v1.GET("/corridas/:slug/resultados/:posicao", api.handleGetResultadoByCorridaAndPosicao)
	v1.GET("/standings", api.handleListStandings)
}
