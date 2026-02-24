package corrida

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
)

func ListByCategoria(ctx context.Context, queries *pgstore.Queries, categoriaSlug string) ([]pgstore.Corrida, error) {
	return queries.ListCorridasByCategoria(ctx, categoriaSlug)
}
