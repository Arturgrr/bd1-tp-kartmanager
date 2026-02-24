package equipe

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
)

func List(ctx context.Context, queries *pgstore.Queries) ([]pgstore.Equipe, error) {
	return queries.ListEquipes(ctx)
}
