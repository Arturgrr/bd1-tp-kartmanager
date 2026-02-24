-- Write your migrate up statements here

CREATE TABLE IF NOT EXISTS piloto_temporada (
  piloto_cpf VARCHAR(11) NOT NULL REFERENCES piloto(cpf),
  temporada VARCHAR NOT NULL,
  categoria_slug VARCHAR NOT NULL REFERENCES categoria(slug),
  equipe_slug VARCHAR NOT NULL REFERENCES equipe(slug),
  pontos INT NOT NULL,
  vitorias INT NOT NULL,
  podios INT NOT NULL,
  melhor_volta VARCHAR,
  posicao INT NOT NULL,
  PRIMARY KEY (piloto_cpf, temporada, categoria_slug)
);

---- create above / drop below ----

DROP TABLE IF EXISTS piloto_temporada;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
