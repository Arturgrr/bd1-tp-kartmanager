-- name: GetAdminByEmail :one
SELECT email, password_hash
FROM admin
WHERE email = $1;
