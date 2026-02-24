package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/corrida"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CorridaService struct {
	queries *pgstore.Queries
}

func NewCorridaService(pool *pgxpool.Pool) *CorridaService {
	return &CorridaService{queries: pgstore.New(pool)}
}

func (s *CorridaService) List(ctx context.Context) ([]pgstore.Corrida, error) {
	return corrida.List(ctx, s.queries)
}

func (s *CorridaService) GetBySlug(ctx context.Context, slug string) (pgstore.Corrida, error) {
	return corrida.GetBySlug(ctx, s.queries, slug)
}

func (s *CorridaService) ListCompleted(ctx context.Context) ([]pgstore.Corrida, error) {
	return corrida.ListCompleted(ctx, s.queries)
}

func (s *CorridaService) ListUpcoming(ctx context.Context) ([]pgstore.Corrida, error) {
	return corrida.ListUpcoming(ctx, s.queries)
}

func (s *CorridaService) ListByCategoria(ctx context.Context, categoriaSlug string) ([]pgstore.Corrida, error) {
	return corrida.ListByCategoria(ctx, s.queries, categoriaSlug)
}
