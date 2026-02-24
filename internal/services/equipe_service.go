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

func (s *EquipeService) Create(ctx context.Context, slug, name, cor string, anoFundacao int32, cidade string) (pgstore.Equipe, error) {
	return equipe.Create(ctx, s.queries, slug, name, cor, anoFundacao, cidade)
}

func (s *EquipeService) Update(ctx context.Context, slug, name, cor string, anoFundacao int32, cidade string) (pgstore.Equipe, error) {
	return equipe.Update(ctx, s.queries, slug, name, cor, anoFundacao, cidade)
}

func (s *EquipeService) Delete(ctx context.Context, slug string) error {
	return equipe.Delete(ctx, s.queries, slug)
}
