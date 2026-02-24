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

func (s *StandingsService) Create(ctx context.Context, pilotoCpf, temporada, categoriaSlug, equipeSlug string, pontos, vitorias, podios int32, melhorVolta string, posicao int32) (pgstore.PilotoTemporada, error) {
	return standings.Create(ctx, s.queries, pilotoCpf, temporada, categoriaSlug, equipeSlug, pontos, vitorias, podios, melhorVolta, posicao)
}

func (s *StandingsService) Update(ctx context.Context, pilotoCpf, temporada, categoriaSlug, equipeSlug string, pontos, vitorias, podios int32, melhorVolta string, posicao int32) (pgstore.PilotoTemporada, error) {
	return standings.Update(ctx, s.queries, pilotoCpf, temporada, categoriaSlug, equipeSlug, pontos, vitorias, podios, melhorVolta, posicao)
}

func (s *StandingsService) Delete(ctx context.Context, pilotoCpf, temporada, categoriaSlug string) error {
	return standings.Delete(ctx, s.queries, pilotoCpf, temporada, categoriaSlug)
}
