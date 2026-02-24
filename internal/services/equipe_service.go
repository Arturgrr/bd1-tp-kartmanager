package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/equipe"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EquipeService struct {
	queries *pgstore.Queries
}

func NewEquipeService(pool *pgxpool.Pool) *EquipeService {
	return &EquipeService{queries: pgstore.New(pool)}
}

func (s *EquipeService) List(ctx context.Context) ([]pgstore.Equipe, error) {
	return equipe.List(ctx, s.queries)
}

func (s *EquipeService) GetBySlug(ctx context.Context, slug string) (pgstore.Equipe, error) {
	return equipe.GetBySlug(ctx, s.queries, slug)
}
