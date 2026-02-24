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

-- name: UpdateEquipe :one
UPDATE equipe
SET nome = $2, cor = $3, ano_fundacao = $4, cidade = $5
WHERE slug = $1
RETURNING slug, nome, cor, ano_fundacao, cidade;

-- name: DeleteEquipe :exec
DELETE FROM equipe WHERE slug = $1;
