package api

import (
	"errors"
	"net/http"

	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type categoriaResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	MinAge      int32  `json:"minAge"`
	MaxAge      int32  `json:"maxAge"`
	Description string `json:"description"`
}

func toCategoriaResponse(c pgstore.Categorium) categoriaResponse {
	return categoriaResponse{
		ID:          c.Slug,
		Name:        c.Nome,
		Slug:        c.Slug,
		MinAge:      c.IdadeMinima,
		MaxAge:      c.IdadeMaxima,
		Description: c.Descricao,
	}
}

// handleListCategorias godoc
//
//	@Summary	Lista todas as categorias
//	@Tags		categorias
//	@Produce	json
//	@Success	200	{array}		categoriaResponse
//	@Failure	500	{object}	map[string]string
//	@Router		/categorias [get]
func (api *API) handleListCategorias(c *gin.Context) {
	list, err := api.categoriaService.List(c.Request.Context())
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list categories"})
		return
	}
	resp := make([]categoriaResponse, 0, len(list))
	for _, item := range list {
		resp = append(resp, toCategoriaResponse(item))
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, resp)
}

// handleGetCategoriaBySlug godoc
//
//	@Summary	Busca categoria por slug
//	@Tags		categorias
//	@Produce	json
//	@Param		slug	path		string	true	"Slug da categoria"
//	@Success	200	{object}	categoriaResponse
//	@Failure	400	{object}	map[string]string
//	@Failure	404	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/categorias/{slug} [get]
func (api *API) handleGetCategoriaBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	cat, err := api.categoriaService.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "category not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to get category"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, toCategoriaResponse(cat))
}
