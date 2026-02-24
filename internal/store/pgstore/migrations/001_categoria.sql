-- Write your migrate up statements here

CREATE TABLE IF NOT EXISTS categoria (
  slug VARCHAR PRIMARY KEY,
  nome VARCHAR NOT NULL,
  idade_minima INT NOT NULL,
  idade_maxima INT NOT NULL,
  descricao TEXT NOT NULL
);

---- create above / drop below ----

DROP TABLE IF EXISTS categoria;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
