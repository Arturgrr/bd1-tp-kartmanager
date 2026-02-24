package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/categoria"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CategoriaService struct {
	queries *pgstore.Queries
}

func NewCategoriaService(pool *pgxpool.Pool) *CategoriaService {
	return &CategoriaService{queries: pgstore.New(pool)}
}

func (s *CategoriaService) List(ctx context.Context) ([]pgstore.Categorium, error) {
	return categoria.List(ctx, s.queries)
}

func (s *CategoriaService) GetBySlug(ctx context.Context, slug string) (pgstore.Categorium, error) {
	return categoria.GetBySlug(ctx, s.queries, slug)
}
