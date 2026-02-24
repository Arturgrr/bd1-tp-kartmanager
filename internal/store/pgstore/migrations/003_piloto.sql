-- Write your migrate up statements here

CREATE TABLE IF NOT EXISTS piloto (
  cpf VARCHAR(11) PRIMARY KEY,
  nome VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  numero INT NOT NULL,
  ano_nascimento INT NOT NULL,
  cidade VARCHAR NOT NULL,
  equipe_slug VARCHAR NOT NULL REFERENCES equipe(slug),
  categoria_slug VARCHAR NOT NULL REFERENCES categoria(slug)
);

---- create above / drop below ----

DROP TABLE IF EXISTS piloto;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
