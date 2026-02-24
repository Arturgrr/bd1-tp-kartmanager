package standings

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Delete(ctx context.Context, queries *pgstore.Queries, pilotoCpf, temporada, categoriaSlug string) error {
	_, err := queries.GetPilotoTemporada(ctx, pgstore.GetPilotoTemporadaParams{
		PilotoCpf:     pilotoCpf,
		Temporada:     temporada,
		CategoriaSlug: categoriaSlug,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.ErrNotFound
		}
		return err
	}
	return queries.DeletePilotoTemporada(ctx, pgstore.DeletePilotoTemporadaParams{
		PilotoCpf:     pilotoCpf,
		Temporada:     temporada,
		CategoriaSlug: categoriaSlug,
	})
}
