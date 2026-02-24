package piloto

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Update(ctx context.Context, queries *pgstore.Queries, cpf, name, slug string, number, birthYear int32, city, teamSlug, categorySlug string) (pgstore.Piloto, error) {
	_, err := queries.GetPilotoByCpf(ctx, cpf)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return pgstore.Piloto{}, domain.ErrNotFound
		}
		return pgstore.Piloto{}, err
	}
	return queries.UpdatePiloto(ctx, pgstore.UpdatePilotoParams{
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
