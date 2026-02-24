-- name: ListCorridas :many
SELECT slug, nome, data, pista, categoria_slug, temporada, status
FROM corrida
ORDER BY data DESC;

-- name: GetCorridaBySlug :one
SELECT slug, nome, data, pista, categoria_slug, temporada, status
FROM corrida
WHERE slug = $1;

-- name: ListCorridasByCategoria :many
SELECT slug, nome, data, pista, categoria_slug, temporada, status
FROM corrida
WHERE categoria_slug = $1
ORDER BY data DESC;

-- name: ListCorridasUpcoming :many
SELECT slug, nome, data, pista, categoria_slug, temporada, status
FROM corrida
WHERE status = 'upcoming'
ORDER BY data;

-- name: ListCorridasCompleted :many
SELECT slug, nome, data, pista, categoria_slug, temporada, status
FROM corrida
WHERE status = 'completed'
ORDER BY data DESC;

-- name: CreateCorrida :one
INSERT INTO corrida (slug, nome, data, pista, categoria_slug, temporada, status)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING slug, nome, data, pista, categoria_slug, temporada, status;

-- name: UpdateCorrida :one
UPDATE corrida
SET nome = $2, data = $3, pista = $4, categoria_slug = $5, temporada = $6, status = $7
WHERE slug = $1
RETURNING slug, nome, data, pista, categoria_slug, temporada, status;

-- name: DeleteCorrida :exec
DELETE FROM corrida WHERE slug = $1;
