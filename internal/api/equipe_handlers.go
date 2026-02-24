package api

import (
	"errors"
	"net/http"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/equipe"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type equipeResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Color       string `json:"color"`
	FoundedYear int32  `json:"foundedYear"`
	City        string `json:"city"`
}

func toEquipeResponse(e pgstore.Equipe) equipeResponse {
	return equipeResponse{
		ID:          e.Slug,
		Name:        e.Nome,
		Slug:        e.Slug,
		Color:       e.Cor,
		FoundedYear: e.AnoFundacao,
		City:        e.Cidade,
	}
}

// handleListEquipes godoc
//
//	@Summary	Lista todas as equipes
//	@Tags		equipes
//	@Produce	json
//	@Success	200	{array}		equipeResponse
//	@Failure	500	{object}	map[string]string
//	@Router		/equipes [get]
func (api *API) handleListEquipes(c *gin.Context) {
	list, err := api.equipeService.List(c.Request.Context())
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list teams"})
		return
	}
	resp := make([]equipeResponse, 0, len(list))
	for _, item := range list {
		resp = append(resp, toEquipeResponse(item))
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, resp)
}

// handleGetEquipeBySlug godoc
//
//	@Summary	Busca equipe por slug
//	@Tags		equipes
//	@Produce	json
//	@Param		slug	path		string	true	"Slug da equipe"
//	@Success	200	{object}	equipeResponse
//	@Failure	400	{object}	map[string]string
//	@Failure	404	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/equipes/{slug} [get]
func (api *API) handleGetEquipeBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	e, err := api.equipeService.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "team not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to get team"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, toEquipeResponse(e))
}

// handleCreateEquipe godoc
//
//	@Summary	Cria equipe (admin)
//	@Tags		admin-equipes
//	@Accept		json
//	@Produce	json
//	@Param		body	body		equipe.CreateEquipeReq	true	"Body"
//	@Success	201		{object}	equipeResponse
//	@Failure	400		{object}	map[string]any
//	@Failure	401		{object}	map[string]string
//	@Failure	409		{object}	map[string]string
//	@Failure	422		{object}	map[string]string
//	@Failure	500		{object}	map[string]string
//	@Router		/admin/equipes [post]
func (api *API) handleCreateEquipe(c *gin.Context) {
	data, problems, err := jsonutils.DecodeValidJSON[equipe.CreateEquipeReq](c)
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
	e, err := api.equipeService.Create(c.Request.Context(), data.Slug, data.Name, data.Color, data.FoundedYear, data.City)
	if err != nil {
		if errors.Is(err, domain.ErrAlreadyExists) {
			_ = jsonutils.EncodeJSON(c, http.StatusConflict, gin.H{"error": "team already exists"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to create team"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusCreated, toEquipeResponse(e))
}

// handleUpdateEquipe godoc
//
//	@Summary	Atualiza equipe (admin)
//	@Tags		admin-equipes
//	@Accept		json
//	@Produce	json
//	@Param		slug	path		string	true	"Slug"
//	@Param		body	body		equipe.UpdateEquipeReq	true	"Body"
//	@Success	200		{object}	equipeResponse
//	@Failure	400		{object}	map[string]any
//	@Failure	401		{object}	map[string]string
//	@Failure	404		{object}	map[string]string
//	@Failure	422		{object}	map[string]string
//	@Failure	500		{object}	map[string]string
//	@Router		/admin/equipes/{slug} [put]
func (api *API) handleUpdateEquipe(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	data, problems, err := jsonutils.DecodeValidJSON[equipe.UpdateEquipeReq](c)
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
	e, err := api.equipeService.Update(c.Request.Context(), slug, data.Name, data.Color, data.FoundedYear, data.City)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "team not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to update team"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, toEquipeResponse(e))
}

// handleDeleteEquipe godoc
//
//	@Summary	Remove equipe (admin)
//	@Tags		admin-equipes
//	@Param		slug	path		string	true	"Slug"
//	@Success	204	"No Content"
//	@Failure	401	{object}	map[string]string
//	@Failure	404	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/admin/equipes/{slug} [delete]
func (api *API) handleDeleteEquipe(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	err := api.equipeService.Delete(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "team not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to delete team"})
		return
	}
	c.Status(http.StatusNoContent)
}

