package corrida

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
)

func GetBySlug(ctx context.Context, queries *pgstore.Queries, slug string) (pgstore.Corrida, error) {
	return queries.GetCorridaBySlug(ctx, slug)
}
