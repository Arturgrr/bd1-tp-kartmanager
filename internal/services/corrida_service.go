package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CorridaService struct {
	queries *pgstore.Queries
}

func NewCorridaService(pool *pgxpool.Pool) *CorridaService {
	return &CorridaService{queries: pgstore.New(pool)}
}

func (s *CorridaService) List(ctx context.Context) ([]pgstore.Corrida, error) {
	return s.queries.ListCorridas(ctx)
}

func (s *CorridaService) GetBySlug(ctx context.Context, slug string) (pgstore.Corrida, error) {
	return s.queries.GetCorridaBySlug(ctx, slug)
}

func (s *CorridaService) ListCompleted(ctx context.Context) ([]pgstore.Corrida, error) {
	return s.queries.ListCorridasCompleted(ctx)
}

func (s *CorridaService) ListUpcoming(ctx context.Context) ([]pgstore.Corrida, error) {
	return s.queries.ListCorridasUpcoming(ctx)
}

func (s *CorridaService) ListByCategoria(ctx context.Context, categoriaSlug string) ([]pgstore.Corrida, error) {
	return s.queries.ListCorridasByCategoria(ctx, categoriaSlug)
}

