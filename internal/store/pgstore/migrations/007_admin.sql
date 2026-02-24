-- Write your migrate up statements here

CREATE TABLE IF NOT EXISTS admin (
  email VARCHAR(255) PRIMARY KEY,
  password_hash BYTEA NOT NULL
);

---- create above / drop below ----

DROP TABLE IF EXISTS admin;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
