-- Write your migrate up statements here

CREATE TABLE IF NOT EXISTS corrida (
  slug VARCHAR PRIMARY KEY,
  nome VARCHAR NOT NULL,
  data DATE NOT NULL,
  pista VARCHAR NOT NULL,
  categoria_slug VARCHAR NOT NULL REFERENCES categoria(slug),
  temporada VARCHAR NOT NULL,
  status VARCHAR NOT NULL
);

---- create above / drop below ----

DROP TABLE IF EXISTS corrida;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
