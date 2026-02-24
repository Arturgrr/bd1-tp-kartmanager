package resultado

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Create(ctx context.Context, queries *pgstore.Queries, corridaSlug string, posicao int32, pilotoCpf, equipeSlug, melhorVolta, tempoTotal string, pontos int32) (pgstore.ResultadoCorrida, error) {
	_, err := queries.GetResultadoByCorridaAndPosicao(ctx, pgstore.GetResultadoByCorridaAndPosicaoParams{
		CorridaSlug: corridaSlug,
		Posicao:     posicao,
	})
	if err == nil {
		return pgstore.ResultadoCorrida{}, domain.ErrAlreadyExists
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return pgstore.ResultadoCorrida{}, err
	}
	return queries.CreateResultadoCorrida(ctx, pgstore.CreateResultadoCorridaParams{
		CorridaSlug: corridaSlug,
		Posicao:     posicao,
		PilotoCpf:   pilotoCpf,
		EquipeSlug:  equipeSlug,
		MelhorVolta: melhorVolta,
		TempoTotal:  tempoTotal,
		Pontos:      pontos,
	})
}
