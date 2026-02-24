package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/piloto"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PilotoService struct {
	queries *pgstore.Queries
}

func NewPilotoService(pool *pgxpool.Pool) *PilotoService {
	return &PilotoService{queries: pgstore.New(pool)}
}

func (s *PilotoService) List(ctx context.Context) ([]pgstore.Piloto, error) {
	return piloto.List(ctx, s.queries)
}

func (s *PilotoService) GetBySlug(ctx context.Context, slug string) (pgstore.Piloto, error) {
	return piloto.GetBySlug(ctx, s.queries, slug)
}

func (s *PilotoService) Create(ctx context.Context, cpf, name, slug string, number, birthYear int32, city, teamSlug, categorySlug string) (pgstore.Piloto, error) {
	return piloto.Create(ctx, s.queries, cpf, name, slug, number, birthYear, city, teamSlug, categorySlug)
}

func (s *PilotoService) Update(ctx context.Context, cpf, name, slug string, number, birthYear int32, city, teamSlug, categorySlug string) (pgstore.Piloto, error) {
	return piloto.Update(ctx, s.queries, cpf, name, slug, number, birthYear, city, teamSlug, categorySlug)
}

func (s *PilotoService) UpdateBySlug(ctx context.Context, pathSlug, name, newSlug string, number, birthYear int32, city, teamSlug, categorySlug string) (pgstore.Piloto, error) {
	p, err := piloto.GetBySlug(ctx, s.queries, pathSlug)
	if err != nil {
		return pgstore.Piloto{}, err
	}
	return piloto.Update(ctx, s.queries, p.Cpf, name, newSlug, number, birthYear, city, teamSlug, categorySlug)
}

func (s *PilotoService) Delete(ctx context.Context, cpf string) error {
	return piloto.Delete(ctx, s.queries, cpf)
}

func (s *PilotoService) DeleteBySlug(ctx context.Context, slug string) error {
	p, err := piloto.GetBySlug(ctx, s.queries, slug)
	if err != nil {
		return err
	}
	return piloto.Delete(ctx, s.queries, p.Cpf)
}
