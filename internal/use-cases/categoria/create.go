package categoria

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Create(ctx context.Context, queries *pgstore.Queries, slug, name string, minAge, maxAge int32, description string) (pgstore.Categorium, error) {
	_, err := queries.GetCategoriaBySlug(ctx, slug)
	if err == nil {
		return pgstore.Categorium{}, domain.ErrAlreadyExists
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return pgstore.Categorium{}, err
	}
	return queries.CreateCategoria(ctx, pgstore.CreateCategoriaParams{
		Slug:        slug,
		Nome:        name,
		IdadeMinima: minAge,
		IdadeMaxima: maxAge,
		Descricao:   description,
	})
}
