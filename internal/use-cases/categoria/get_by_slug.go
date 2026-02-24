package categoria

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
)

func GetBySlug(ctx context.Context, queries *pgstore.Queries, slug string) (pgstore.Categorium, error) {
	return queries.GetCategoriaBySlug(ctx, slug)
}
