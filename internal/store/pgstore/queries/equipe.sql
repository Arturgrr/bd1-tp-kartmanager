-- name: ListEquipes :many
SELECT slug, nome, cor, ano_fundacao, cidade
FROM equipe
ORDER BY nome;

-- name: GetEquipeBySlug :one
SELECT slug, nome, cor, ano_fundacao, cidade
FROM equipe
WHERE slug = $1;

-- name: CreateEquipe :one
INSERT INTO equipe (slug, nome, cor, ano_fundacao, cidade)
VALUES ($1, $2, $3, $4, $5)
RETURNING slug, nome, cor, ano_fundacao, cidade;
