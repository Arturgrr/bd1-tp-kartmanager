package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5/pgxpool"
)

type StandingsService struct {
	queries *pgstore.Queries
}

func NewStandingsService(pool *pgxpool.Pool) *StandingsService {
	return &StandingsService{queries: pgstore.New(pool)}
}

func (s *StandingsService) ListByPiloto(ctx context.Context, pilotoCpf string) ([]pgstore.PilotoTemporada, error) {
	return s.queries.ListPilotoTemporadaByPiloto(ctx, pilotoCpf)
}

func (s *StandingsService) ListByCategoriaAndTemporada(ctx context.Context, categoriaSlug string, temporada string) ([]pgstore.PilotoTemporada, error) {
	params := pgstore.ListStandingsByCategoriaAndTemporadaParams{
		CategoriaSlug: categoriaSlug,
		Temporada:     temporada,
	}
	return s.queries.ListStandingsByCategoriaAndTemporada(ctx, params)
}

