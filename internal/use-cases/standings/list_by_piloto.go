package standings

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
)

func ListByPiloto(ctx context.Context, queries *pgstore.Queries, pilotoCpf string) ([]pgstore.PilotoTemporada, error) {
	return queries.ListPilotoTemporadaByPiloto(ctx, pilotoCpf)
}
