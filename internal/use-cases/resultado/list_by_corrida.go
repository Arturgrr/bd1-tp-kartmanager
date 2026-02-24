package resultado

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
)

func ListByCorrida(ctx context.Context, queries *pgstore.Queries, corridaSlug string) ([]pgstore.ResultadoCorrida, error) {
	return queries.ListResultadosByCorrida(ctx, corridaSlug)
}
