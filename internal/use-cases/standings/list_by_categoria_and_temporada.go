package standings

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
)

func ListByCategoriaAndTemporada(ctx context.Context, queries *pgstore.Queries, categoriaSlug string, temporada string) ([]pgstore.PilotoTemporada, error) {
	params := pgstore.ListStandingsByCategoriaAndTemporadaParams{
		CategoriaSlug: categoriaSlug,
		Temporada:     temporada,
	}
	return queries.ListStandingsByCategoriaAndTemporada(ctx, params)
}
