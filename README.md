1. **Equipes**
   - `GET /api/v1/equipes` – Listar equipes (nome, slug, cor, ano fundação, cidade, etc.).
   - `GET /api/v1/equipes/:slug` – Detalhe da equipe (incluindo pilotos por categoria, se fizer sentido).

2. **Corridas**
   - `GET /api/v1/corridas` – Listar corridas (filtros opcionais: temporada, categoria, status).
   - `GET /api/v1/corridas/:slug` – Detalhe da corrida (incluindo resultados, se houver).

3. **Resultados**
   - `GET /api/v1/resultados` ou resultados dentro de `GET /api/v1/corridas/:slug` – Lista de resultados (por corrida e, se aplicável, por categoria).
   - Ou: `GET /api/v1/corridas/:slug/resultados` – Resultados de uma corrida.

4. **Classificação por categoria / temporada**
   - `GET /api/v1/categorias/:slug/classificacao?temporada=2025` – Classificação (pilotos, pontos, vitórias, pódios, melhor volta, posição) de uma categoria em uma temporada.
   - Usado na página de detalhe da categoria e no histórico do piloto.

5. **Histórico do piloto (temporadas / resultados)**
   - `GET /api/v1/pilotos/:slug/temporadas` ou dados já em `GET /api/v1/pilotos/:slug` – Histórico por temporada (categoria, equipe, pontos, vitórias, pódios, posição, melhor volta).
   - `GET /api/v1/pilotos/:slug/resultados` ou equivalente – Resultados em corridas (corrida, posição, pontos, melhor volta, tempo total).
   - Usado na página de detalhe do piloto (tabelas “Histórico por temporada” e “Resultados em corridas”).