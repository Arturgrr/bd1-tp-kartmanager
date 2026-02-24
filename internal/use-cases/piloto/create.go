package piloto

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Create(ctx context.Context, queries *pgstore.Queries, cpf, name, slug string, number, birthYear int32, city, teamSlug, categorySlug string) (pgstore.Piloto, error) {
	_, err := queries.GetPilotoByCpf(ctx, cpf)
	if err == nil {
		return pgstore.Piloto{}, domain.ErrAlreadyExists
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return pgstore.Piloto{}, err
	}
	_, err = queries.GetPilotoBySlug(ctx, slug)
	if err == nil {
		return pgstore.Piloto{}, domain.ErrAlreadyExists
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return pgstore.Piloto{}, err
	}
	return queries.CreatePiloto(ctx, pgstore.CreatePilotoParams{
		Cpf:           cpf,
		Nome:          name,
		Slug:          slug,
		Numero:        number,
		AnoNascimento: birthYear,
		Cidade:        city,
		EquipeSlug:    teamSlug,
		CategoriaSlug: categorySlug,
	})
}
