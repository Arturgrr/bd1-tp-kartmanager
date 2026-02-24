-- name: ListCategorias :many
SELECT slug, nome, idade_minima, idade_maxima, descricao
FROM categoria
ORDER BY idade_minima;

-- name: GetCategoriaBySlug :one
SELECT slug, nome, idade_minima, idade_maxima, descricao
FROM categoria
WHERE slug = $1;

-- name: CreateCategoria :one
INSERT INTO categoria (slug, nome, idade_minima, idade_maxima, descricao)
VALUES ($1, $2, $3, $4, $5)
RETURNING slug, nome, idade_minima, idade_maxima, descricao;

-- name: UpdateCategoria :one
UPDATE categoria
SET nome = $2, idade_minima = $3, idade_maxima = $4, descricao = $5
WHERE slug = $1
RETURNING slug, nome, idade_minima, idade_maxima, descricao;

-- name: DeleteCategoria :exec
DELETE FROM categoria WHERE slug = $1;
