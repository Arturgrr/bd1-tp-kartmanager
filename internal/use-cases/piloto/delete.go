package piloto

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
)

func Delete(ctx context.Context, queries *pgstore.Queries, cpf string) error {
	_, err := queries.GetPilotoByCpf(ctx, cpf)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.ErrNotFound
		}
		return err
	}
	return queries.DeletePiloto(ctx, cpf)
}
