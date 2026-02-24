package categoria

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Update(ctx context.Context, queries *pgstore.Queries, slug, name string, minAge, maxAge int32, description string) (pgstore.Categorium, error) {
	_, err := queries.GetCategoriaBySlug(ctx, slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return pgstore.Categorium{}, domain.ErrNotFound
		}
		return pgstore.Categorium{}, err
	}
	return queries.UpdateCategoria(ctx, pgstore.UpdateCategoriaParams{
		Slug:        slug,
		Nome:        name,
		IdadeMinima: minAge,
		IdadeMaxima: maxAge,
		Descricao:   description,
	})
}
