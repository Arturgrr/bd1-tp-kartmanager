package corrida

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Update(ctx context.Context, queries *pgstore.Queries, slug, name, dateStr, track, categorySlug, season, status string) (pgstore.Corrida, error) {
	_, err := queries.GetCorridaBySlug(ctx, slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return pgstore.Corrida{}, domain.ErrNotFound
		}
		return pgstore.Corrida{}, err
	}
	date, err := parseDate(dateStr)
	if err != nil {
		return pgstore.Corrida{}, err
	}
	return queries.UpdateCorrida(ctx, pgstore.UpdateCorridaParams{
		Slug:          slug,
		Nome:          name,
		Data:          date,
		Pista:         track,
		CategoriaSlug: categorySlug,
		Temporada:     season,
		Status:        status,
	})
}
