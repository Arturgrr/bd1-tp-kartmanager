package resultado

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
)

func GetByCorridaAndPosicao(ctx context.Context, queries *pgstore.Queries, corridaSlug string, posicao int32) (pgstore.ResultadoCorrida, error) {
	params := pgstore.GetResultadoByCorridaAndPosicaoParams{
		CorridaSlug: corridaSlug,
		Posicao:     posicao,
	}
	return queries.GetResultadoByCorridaAndPosicao(ctx, params)
}
