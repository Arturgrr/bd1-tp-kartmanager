build:
	@go build -o main ./cmd/api

migration-new:
	@test -n "$(NAME)" || (echo "Use: make migration-new NAME=nome_da_migration" && exit 1)
	@tern new $(NAME) --migrations ./internal/store/pgstore/migrations

migrate:
	@go run ./cmd/terndotenv

sqlc-generate:
	@cd internal/store/pgstore && sqlc generate

swagger:
	@swag init -g cmd/api/main.go -o docs --parseDependency --parseInternal

kubb-generate:
	@cd frontend && pnpm run generate

watch:
	@if command -v air > /dev/null; then \
            air; \
            echo "Watching...";\
        else \
            read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
            if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
                go install github.com/air-verse/air@latest; \
                air; \
                echo "Watching...";\
            else \
                echo "You chose not to install air. Exiting..."; \
                exit 1; \
            fi; \
        fi