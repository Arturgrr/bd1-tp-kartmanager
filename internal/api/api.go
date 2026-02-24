package api

import (
	"github.com/arturgrr/bd1-kartmanager/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type API struct {
	router           *gin.Engine
	pool             *pgxpool.Pool
	sessionSecret    []byte
	categoriaService *services.CategoriaService
	pilotoService    *services.PilotoService
	equipeService    *services.EquipeService
	corridaService   *services.CorridaService
	resultadoService *services.ResultadoService
	standingsService *services.StandingsService
	adminService     *services.AdminService
}

func NewAPI(pool *pgxpool.Pool, sessionSecret []byte) *API {
	if len(sessionSecret) == 0 {
		sessionSecret = []byte("dev-secret-change-in-production")
	}
	return &API{
		router:           gin.New(),
		pool:             pool,
		sessionSecret:    sessionSecret,
		categoriaService: services.NewCategoriaService(pool),
		pilotoService:    services.NewPilotoService(pool),
		equipeService:    services.NewEquipeService(pool),
		corridaService:   services.NewCorridaService(pool),
		resultadoService: services.NewResultadoService(pool),
		standingsService: services.NewStandingsService(pool),
		adminService:     services.NewAdminService(pool),
	}
}

func (api *API) Run(addr string) error {
	return api.router.Run(addr)
}
