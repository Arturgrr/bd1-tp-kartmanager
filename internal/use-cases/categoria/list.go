package categoria

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
)

func List(ctx context.Context, queries *pgstore.Queries) ([]pgstore.Categorium, error) {
	return queries.ListCategorias(ctx)
}
