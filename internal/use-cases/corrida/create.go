package corrida

import (
	"context"
	"errors"
	"time"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

func parseDate(dateStr string) (pgtype.Date, error) {
	t, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return pgtype.Date{}, err
	}
	return pgtype.Date{Time: t, Valid: true}, nil
}

func Create(ctx context.Context, queries *pgstore.Queries, slug, name, dateStr, track, categorySlug, season, status string) (pgstore.Corrida, error) {
	_, err := queries.GetCorridaBySlug(ctx, slug)
	if err == nil {
		return pgstore.Corrida{}, domain.ErrAlreadyExists
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return pgstore.Corrida{}, err
	}
	date, err := parseDate(dateStr)
	if err != nil {
		return pgstore.Corrida{}, err
	}
	return queries.CreateCorrida(ctx, pgstore.CreateCorridaParams{
		Slug:          slug,
		Nome:          name,
		Data:          date,
		Pista:         track,
		CategoriaSlug: categorySlug,
		Temporada:     season,
		Status:        status,
	})
}
