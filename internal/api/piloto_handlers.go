package api

import (
	"errors"
	"net/http"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/piloto"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type pilotoResponse struct {
	CPF           string `json:"cpf"`
	Name          string `json:"name"`
	Slug          string `json:"slug"`
	Number        int32  `json:"number"`
	BirthYear     int32  `json:"birthYear"`
	City          string `json:"city"`
	TeamSlug      string `json:"teamSlug"`
	CategorySlug  string `json:"categorySlug"`
}

func toPilotoResponse(p pgstore.Piloto) pilotoResponse {
	return pilotoResponse{
		CPF:          p.Cpf,
		Name:         p.Nome,
		Slug:         p.Slug,
		Number:       p.Numero,
		BirthYear:    p.AnoNascimento,
		City:         p.Cidade,
		TeamSlug:     p.EquipeSlug,
		CategorySlug: p.CategoriaSlug,
	}
}

// handleListPilotos godoc
//
//	@Summary	Lista todos os pilotos
//	@Tags		pilotos
//	@Produce	json
//	@Success	200	{array}		pilotoResponse
//	@Failure	500	{object}	map[string]string
//	@Router		/pilotos [get]
func (api *API) handleListPilotos(c *gin.Context) {
	list, err := api.pilotoService.List(c.Request.Context())
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list pilots"})
		return
	}
	resp := make([]pilotoResponse, 0, len(list))
	for _, item := range list {
		resp = append(resp, toPilotoResponse(item))
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, resp)
}

// handleGetPilotoBySlug godoc
//
//	@Summary	Busca piloto por slug
//	@Tags		pilotos
//	@Produce	json
//	@Param		slug	path		string	true	"Slug do piloto"
//	@Success	200	{object}	pilotoResponse
//	@Failure	400	{object}	map[string]string
//	@Failure	404	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/pilotos/{slug} [get]
func (api *API) handleGetPilotoBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	p, err := api.pilotoService.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "pilot not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to get pilot"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, toPilotoResponse(p))
}

// handleCreatePiloto godoc
//
//	@Summary	Cria piloto (admin)
//	@Tags		admin-pilotos
//	@Accept		json
//	@Produce	json
//	@Param		body	body		piloto.CreatePilotoReq	true	"Body"
//	@Success	201		{object}	pilotoResponse
//	@Failure	400		{object}	map[string]any
//	@Failure	401		{object}	map[string]string
//	@Failure	409		{object}	map[string]string
//	@Failure	422		{object}	map[string]string
//	@Failure	500		{object}	map[string]string
//	@Router		/admin/pilotos [post]
func (api *API) handleCreatePiloto(c *gin.Context) {
	data, problems, err := jsonutils.DecodeValidJSON[piloto.CreatePilotoReq](c)
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
	p, err := api.pilotoService.Create(c.Request.Context(), data.Cpf, data.Name, data.Slug, data.Number, data.BirthYear, data.City, data.TeamSlug, data.CategorySlug)
	if err != nil {
		if errors.Is(err, domain.ErrAlreadyExists) {
			_ = jsonutils.EncodeJSON(c, http.StatusConflict, gin.H{"error": "pilot already exists"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to create pilot"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusCreated, toPilotoResponse(p))
}

// handleUpdatePiloto godoc
//
//	@Summary	Atualiza piloto (admin)
//	@Tags		admin-pilotos
//	@Accept		json
//	@Produce	json
//	@Param		slug	path		string	true	"Slug"
//	@Param		body	body		piloto.UpdatePilotoReq	true	"Body"
//	@Success	200		{object}	pilotoResponse
//	@Failure	400		{object}	map[string]any
//	@Failure	401		{object}	map[string]string
//	@Failure	404		{object}	map[string]string
//	@Failure	422		{object}	map[string]string
//	@Failure	500		{object}	map[string]string
//	@Router		/admin/pilotos/{slug} [put]
func (api *API) handleUpdatePiloto(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	data, problems, err := jsonutils.DecodeValidJSON[piloto.UpdatePilotoReq](c)
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
	p, err := api.pilotoService.UpdateBySlug(c.Request.Context(), slug, data.Name, data.Slug, data.Number, data.BirthYear, data.City, data.TeamSlug, data.CategorySlug)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "pilot not found"})
			return
		}
		if errors.Is(err, pgx.ErrNoRows) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "pilot not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to update pilot"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, toPilotoResponse(p))
}

// handleDeletePiloto godoc
//
//	@Summary	Remove piloto (admin)
//	@Tags		admin-pilotos
//	@Param		slug	path		string	true	"Slug"
//	@Success	204	"No Content"
//	@Failure	401	{object}	map[string]string
//	@Failure	404	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/admin/pilotos/{slug} [delete]
func (api *API) handleDeletePiloto(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	err := api.pilotoService.DeleteBySlug(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "pilot not found"})
			return
		}
		if errors.Is(err, pgx.ErrNoRows) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "pilot not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to delete pilot"})
		return
	}
	c.Status(http.StatusNoContent)
}
