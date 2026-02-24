package services

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/admin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AdminService struct {
	queries *pgstore.Queries
}

func NewAdminService(pool *pgxpool.Pool) *AdminService {
	return &AdminService{queries: pgstore.New(pool)}
}

func (s *AdminService) Authenticate(ctx context.Context, email string, password string) (string, error) {
	return admin.Authenticate(ctx, s.queries, email, password)
}
