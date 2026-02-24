package api

import (
	"github.com/arturgrr/bd1-kartmanager/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type API struct {
	router           *gin.Engine
	pool             *pgxpool.Pool
	categoriaService *services.CategoriaService
	pilotoService    *services.PilotoService
}

func NewAPI(pool *pgxpool.Pool) *API {
	return &API{
		router:           gin.New(),
		pool:             pool,
		categoriaService: services.NewCategoriaService(pool),
		pilotoService:    services.NewPilotoService(pool),
	}
}

func (api *API) Run(addr string) error {
	return api.router.Run(addr)
}
