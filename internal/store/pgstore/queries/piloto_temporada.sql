-- name: GetPilotoTemporada :one
SELECT piloto_cpf, temporada, categoria_slug, equipe_slug, pontos, vitorias, podios, melhor_volta, posicao
FROM piloto_temporada
WHERE piloto_cpf = $1 AND temporada = $2 AND categoria_slug = $3;

-- name: ListStandingsByCategoriaAndTemporada :many
SELECT piloto_cpf, temporada, categoria_slug, equipe_slug, pontos, vitorias, podios, melhor_volta, posicao
FROM piloto_temporada
WHERE categoria_slug = $1 AND temporada = $2
ORDER BY posicao;

-- name: ListPilotoTemporadaByPiloto :many
SELECT piloto_cpf, temporada, categoria_slug, equipe_slug, pontos, vitorias, podios, melhor_volta, posicao
FROM piloto_temporada
WHERE piloto_cpf = $1
ORDER BY temporada DESC, categoria_slug;

-- name: CreatePilotoTemporada :one
INSERT INTO piloto_temporada (piloto_cpf, temporada, categoria_slug, equipe_slug, pontos, vitorias, podios, melhor_volta, posicao)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING piloto_cpf, temporada, categoria_slug, equipe_slug, pontos, vitorias, podios, melhor_volta, posicao;
