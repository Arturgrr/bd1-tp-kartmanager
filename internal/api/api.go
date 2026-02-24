package api

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type API struct {
	router *gin.Engine
	pool   *pgxpool.Pool
}

func NewAPI(pool *pgxpool.Pool) *API {
	return &API{
		router: gin.New(),
		pool:   pool,
	}
}

func (api *API) Run(addr string) error {
	return api.router.Run(addr)
}
