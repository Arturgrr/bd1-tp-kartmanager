-- name: ListResultadosByCorrida :many
SELECT corrida_slug, posicao, piloto_cpf, equipe_slug, melhor_volta, tempo_total, pontos
FROM resultado_corrida
WHERE corrida_slug = $1
ORDER BY posicao;

-- name: GetResultadoByCorridaAndPosicao :one
SELECT corrida_slug, posicao, piloto_cpf, equipe_slug, melhor_volta, tempo_total, pontos
FROM resultado_corrida
WHERE corrida_slug = $1 AND posicao = $2;

-- name: CreateResultadoCorrida :one
INSERT INTO resultado_corrida (corrida_slug, posicao, piloto_cpf, equipe_slug, melhor_volta, tempo_total, pontos)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING corrida_slug, posicao, piloto_cpf, equipe_slug, melhor_volta, tempo_total, pontos;

-- name: UpdateResultadoCorrida :one
UPDATE resultado_corrida
SET piloto_cpf = $3, equipe_slug = $4, melhor_volta = $5, tempo_total = $6, pontos = $7
WHERE corrida_slug = $1 AND posicao = $2
RETURNING corrida_slug, posicao, piloto_cpf, equipe_slug, melhor_volta, tempo_total, pontos;

-- name: DeleteResultadoCorrida :exec
DELETE FROM resultado_corrida WHERE corrida_slug = $1 AND posicao = $2;
