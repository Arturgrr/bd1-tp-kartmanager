package admin

import (
	"context"
	"errors"

	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

func Authenticate(ctx context.Context, queries *pgstore.Queries, email string, password string) (string, error) {
	adm, err := queries.GetAdminByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", ErrInvalidCredentials
		}
		return "", err
	}
	if err := bcrypt.CompareHashAndPassword(adm.PasswordHash, []byte(password)); err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return "", ErrInvalidCredentials
		}
		return "", err
	}
	return adm.Email, nil
}
