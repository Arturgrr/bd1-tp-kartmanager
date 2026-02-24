package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/standings"
	"github.com/jackc/pgx/v5/pgxpool"
)

type StandingsService struct {
	queries *pgstore.Queries
}

func NewStandingsService(pool *pgxpool.Pool) *StandingsService {
	return &StandingsService{queries: pgstore.New(pool)}
}

func (s *StandingsService) ListByPiloto(ctx context.Context, pilotoCpf string) ([]pgstore.PilotoTemporada, error) {
	return standings.ListByPiloto(ctx, s.queries, pilotoCpf)
}

func (s *StandingsService) ListByCategoriaAndTemporada(ctx context.Context, categoriaSlug string, temporada string) ([]pgstore.PilotoTemporada, error) {
	return standings.ListByCategoriaAndTemporada(ctx, s.queries, categoriaSlug, temporada)
}
