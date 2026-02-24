-- name: ListPilotos :many
SELECT cpf, nome, slug, numero, ano_nascimento, cidade, equipe_slug, categoria_slug
FROM piloto
ORDER BY nome;

-- name: GetPilotoByCpf :one
SELECT cpf, nome, slug, numero, ano_nascimento, cidade, equipe_slug, categoria_slug
FROM piloto
WHERE cpf = $1;

-- name: GetPilotoBySlug :one
SELECT cpf, nome, slug, numero, ano_nascimento, cidade, equipe_slug, categoria_slug
FROM piloto
WHERE slug = $1;

-- name: ListPilotosByCategoria :many
SELECT cpf, nome, slug, numero, ano_nascimento, cidade, equipe_slug, categoria_slug
FROM piloto
WHERE categoria_slug = $1
ORDER BY nome;

-- name: ListPilotosByEquipe :many
SELECT cpf, nome, slug, numero, ano_nascimento, cidade, equipe_slug, categoria_slug
FROM piloto
WHERE equipe_slug = $1
ORDER BY nome;

-- name: CreatePiloto :one
INSERT INTO piloto (cpf, nome, slug, numero, ano_nascimento, cidade, equipe_slug, categoria_slug)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING cpf, nome, slug, numero, ano_nascimento, cidade, equipe_slug, categoria_slug;
