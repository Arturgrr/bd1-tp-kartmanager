package corrida

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
)

func ListUpcoming(ctx context.Context, queries *pgstore.Queries) ([]pgstore.Corrida, error) {
	return queries.ListCorridasUpcoming(ctx)
}
