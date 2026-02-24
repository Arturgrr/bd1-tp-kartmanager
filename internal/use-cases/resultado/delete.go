package resultado

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Delete(ctx context.Context, queries *pgstore.Queries, corridaSlug string, posicao int32) error {
	_, err := queries.GetResultadoByCorridaAndPosicao(ctx, pgstore.GetResultadoByCorridaAndPosicaoParams{
		CorridaSlug: corridaSlug,
		Posicao:     posicao,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.ErrNotFound
		}
		return err
	}
	return queries.DeleteResultadoCorrida(ctx, pgstore.DeleteResultadoCorridaParams{
		CorridaSlug: corridaSlug,
		Posicao:     posicao,
	})
}
