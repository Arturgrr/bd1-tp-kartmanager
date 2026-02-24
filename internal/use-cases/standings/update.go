package standings

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Update(ctx context.Context, queries *pgstore.Queries, pilotoCpf, temporada, categoriaSlug, equipeSlug string, pontos, vitorias, podios int32, melhorVolta string, posicao int32) (pgstore.PilotoTemporada, error) {
	_, err := queries.GetPilotoTemporada(ctx, pgstore.GetPilotoTemporadaParams{
		PilotoCpf:     pilotoCpf,
		Temporada:     temporada,
		CategoriaSlug: categoriaSlug,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return pgstore.PilotoTemporada{}, domain.ErrNotFound
		}
		return pgstore.PilotoTemporada{}, err
	}
	return queries.UpdatePilotoTemporada(ctx, pgstore.UpdatePilotoTemporadaParams{
		PilotoCpf:     pilotoCpf,
		Temporada:     temporada,
		CategoriaSlug: categoriaSlug,
		EquipeSlug:    equipeSlug,
		Pontos:        pontos,
		Vitorias:      vitorias,
		Podios:        podios,
		MelhorVolta:   melhorVoltaText(melhorVolta),
		Posicao:       posicao,
	})
}
