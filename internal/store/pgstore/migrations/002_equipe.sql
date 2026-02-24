-- Write your migrate up statements here

CREATE TABLE IF NOT EXISTS equipe (
  slug VARCHAR PRIMARY KEY,
  nome VARCHAR NOT NULL,
  cor VARCHAR NOT NULL,
  ano_fundacao INT NOT NULL,
  cidade VARCHAR NOT NULL
);

---- create above / drop below ----

DROP TABLE IF EXISTS equipe;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
