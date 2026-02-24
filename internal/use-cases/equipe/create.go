package equipe

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Create(ctx context.Context, queries *pgstore.Queries, slug, name, color string, foundedYear int32, city string) (pgstore.Equipe, error) {
	_, err := queries.GetEquipeBySlug(ctx, slug)
	if err == nil {
		return pgstore.Equipe{}, domain.ErrAlreadyExists
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return pgstore.Equipe{}, err
	}
	return queries.CreateEquipe(ctx, pgstore.CreateEquipeParams{
		Slug:        slug,
		Nome:        name,
		Cor:         color,
		AnoFundacao: foundedYear,
		Cidade:      city,
	})
}
