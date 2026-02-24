package equipe

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Update(ctx context.Context, queries *pgstore.Queries, slug, name, color string, foundedYear int32, city string) (pgstore.Equipe, error) {
	_, err := queries.GetEquipeBySlug(ctx, slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return pgstore.Equipe{}, domain.ErrNotFound
		}
		return pgstore.Equipe{}, err
	}
	return queries.UpdateEquipe(ctx, pgstore.UpdateEquipeParams{
		Slug:        slug,
		Nome:        name,
		Cor:         color,
		AnoFundacao: foundedYear,
		Cidade:      city,
	})
}
