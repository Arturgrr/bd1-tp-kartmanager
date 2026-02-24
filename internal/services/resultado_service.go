package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ResultadoService struct {
	queries *pgstore.Queries
}

func NewResultadoService(pool *pgxpool.Pool) *ResultadoService {
	return &ResultadoService{queries: pgstore.New(pool)}
}

func (s *ResultadoService) ListByCorrida(ctx context.Context, corridaSlug string) ([]pgstore.ResultadoCorrida, error) {
	return s.queries.ListResultadosByCorrida(ctx, corridaSlug)
}

func (s *ResultadoService) GetByCorridaAndPosicao(ctx context.Context, corridaSlug string, posicao int32) (pgstore.ResultadoCorrida, error) {
	params := pgstore.GetResultadoByCorridaAndPosicaoParams{
		CorridaSlug: corridaSlug,
		Posicao:     posicao,
	}
	return s.queries.GetResultadoByCorridaAndPosicao(ctx, params)
}


