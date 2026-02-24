package api

import "github.com/gin-gonic/gin"

type API struct {
	router *gin.Engine
}

func NewAPI() *API {
	return &API{
		router: gin.Default(),
	}
}