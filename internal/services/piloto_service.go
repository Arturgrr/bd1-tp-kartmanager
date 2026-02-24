package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PilotoService struct {
	queries *pgstore.Queries
}

func NewPilotoService(pool *pgxpool.Pool) *PilotoService {
	return &PilotoService{queries: pgstore.New(pool)}
}

func (s *PilotoService) List(ctx context.Context) ([]pgstore.Piloto, error) {
	return s.queries.ListPilotos(ctx)
}

func (s *PilotoService) GetBySlug(ctx context.Context, slug string) (pgstore.Piloto, error) {
	return s.queries.GetPilotoBySlug(ctx, slug)
}
