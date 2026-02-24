-- Write your migrate up statements here

CREATE TABLE IF NOT EXISTS resultado_corrida (
  corrida_slug VARCHAR NOT NULL REFERENCES corrida(slug),
  posicao INT NOT NULL,
  piloto_cpf VARCHAR(11) NOT NULL REFERENCES piloto(cpf),
  equipe_slug VARCHAR NOT NULL REFERENCES equipe(slug),
  melhor_volta VARCHAR NOT NULL,
  tempo_total VARCHAR NOT NULL,
  pontos INT NOT NULL,
  PRIMARY KEY (corrida_slug, posicao)
);

---- create above / drop below ----

DROP TABLE IF EXISTS resultado_corrida;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
