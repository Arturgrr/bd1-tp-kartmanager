package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/resultado"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ResultadoService struct {
	queries *pgstore.Queries
}

func NewResultadoService(pool *pgxpool.Pool) *ResultadoService {
	return &ResultadoService{queries: pgstore.New(pool)}
}

func (s *ResultadoService) ListByCorrida(ctx context.Context, corridaSlug string) ([]pgstore.ResultadoCorrida, error) {
	return resultado.ListByCorrida(ctx, s.queries, corridaSlug)
}

func (s *ResultadoService) GetByCorridaAndPosicao(ctx context.Context, corridaSlug string, posicao int32) (pgstore.ResultadoCorrida, error) {
	return resultado.GetByCorridaAndPosicao(ctx, s.queries, corridaSlug, posicao)
}

func (s *ResultadoService) Create(ctx context.Context, corridaSlug string, posicao int32, pilotoCpf, equipeSlug, melhorVolta, tempoTotal string, pontos int32) (pgstore.ResultadoCorrida, error) {
	return resultado.Create(ctx, s.queries, corridaSlug, posicao, pilotoCpf, equipeSlug, melhorVolta, tempoTotal, pontos)
}

func (s *ResultadoService) Update(ctx context.Context, corridaSlug string, posicao int32, pilotoCpf, equipeSlug, melhorVolta, tempoTotal string, pontos int32) (pgstore.ResultadoCorrida, error) {
	return resultado.Update(ctx, s.queries, corridaSlug, posicao, pilotoCpf, equipeSlug, melhorVolta, tempoTotal, pontos)
}

func (s *ResultadoService) Delete(ctx context.Context, corridaSlug string, posicao int32) error {
	return resultado.Delete(ctx, s.queries, corridaSlug, posicao)
}
