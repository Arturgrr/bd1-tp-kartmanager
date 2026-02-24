package api

import (
	"errors"
	"net/http"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/categoria"
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

// handleCreateCategoria godoc
//
//	@Summary	Cria categoria (admin)
//	@Tags		admin-categorias
//	@Accept		json
//	@Produce	json
//	@Param		body	body		categoria.CreateCategoriaReq	true	"Body"
//	@Success	201		{object}	categoriaResponse
//	@Failure	400		{object}	map[string]any
//	@Failure	401		{object}	map[string]string
//	@Failure	409		{object}	map[string]string
//	@Failure	422		{object}	map[string]string
//	@Failure	500		{object}	map[string]string
//	@Router		/admin/categorias [post]
func (api *API) handleCreateCategoria(c *gin.Context) {
	data, problems, err := jsonutils.DecodeValidJSON[categoria.CreateCategoriaReq](c)
	if err != nil {
		status := http.StatusUnprocessableEntity
		if problems != nil {
			if _, hasBody := problems["body"]; hasBody {
				status = http.StatusBadRequest
			}
		}
		_ = jsonutils.EncodeJSON(c, status, problems)
		return
	}
	cat, err := api.categoriaService.Create(c.Request.Context(), data.Slug, data.Name, data.MinAge, data.MaxAge, data.Description)
	if err != nil {
		if errors.Is(err, domain.ErrAlreadyExists) {
			_ = jsonutils.EncodeJSON(c, http.StatusConflict, gin.H{"error": "category already exists"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to create category"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusCreated, toCategoriaResponse(cat))
}

// handleUpdateCategoria godoc
//
//	@Summary	Atualiza categoria (admin)
//	@Tags		admin-categorias
//	@Accept		json
//	@Produce	json
//	@Param		slug	path		string	true	"Slug"
//	@Param		body	body		categoria.UpdateCategoriaReq	true	"Body"
//	@Success	200		{object}	categoriaResponse
//	@Failure	400		{object}	map[string]any
//	@Failure	401		{object}	map[string]string
//	@Failure	404		{object}	map[string]string
//	@Failure	422		{object}	map[string]string
//	@Failure	500		{object}	map[string]string
//	@Router		/admin/categorias/{slug} [put]
func (api *API) handleUpdateCategoria(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	data, problems, err := jsonutils.DecodeValidJSON[categoria.UpdateCategoriaReq](c)
	if err != nil {
		status := http.StatusUnprocessableEntity
		if problems != nil {
			if _, hasBody := problems["body"]; hasBody {
				status = http.StatusBadRequest
			}
		}
		_ = jsonutils.EncodeJSON(c, status, problems)
		return
	}
	cat, err := api.categoriaService.Update(c.Request.Context(), slug, data.Name, data.MinAge, data.MaxAge, data.Description)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "category not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to update category"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, toCategoriaResponse(cat))
}

// handleDeleteCategoria godoc
//
//	@Summary	Remove categoria (admin)
//	@Tags		admin-categorias
//	@Param		slug	path		string	true	"Slug"
//	@Success	204	"No Content"
//	@Failure	401	{object}	map[string]string
//	@Failure	404	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/admin/categorias/{slug} [delete]
func (api *API) handleDeleteCategoria(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	err := api.categoriaService.Delete(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "category not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to delete category"})
		return
	}
	c.Status(http.StatusNoContent)
}
