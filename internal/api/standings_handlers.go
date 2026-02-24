package api

import (
	"errors"
	"net/http"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/standings"
	"github.com/gin-gonic/gin"
)

type standingResponse struct {
	PilotID     string `json:"pilotId"`
	Season      string `json:"season"`
	CategoryID  string `json:"categoryId"`
	TeamID      string `json:"teamId"`
	Points      int32  `json:"points"`
	Wins        int32  `json:"wins"`
	Podiums     int32  `json:"podiums"`
	BestLap     string `json:"bestLap"`
	Position    int32  `json:"position"`
}

func toStandingResponse(s pgstore.PilotoTemporada) standingResponse {
	bestLap := ""
	if s.MelhorVolta.Valid {
		bestLap = s.MelhorVolta.String
	}

	return standingResponse{
		PilotID:    s.PilotoCpf,
		Season:     s.Temporada,
		CategoryID: s.CategoriaSlug,
		TeamID:     s.EquipeSlug,
		Points:     s.Pontos,
		Wins:       s.Vitorias,
		Podiums:    s.Podios,
		BestLap:    bestLap,
		Position:   s.Posicao,
	}
}

// handleListStandings godoc
//
//	@Summary	Lista standings por categoria e temporada
//	@Tags		standings
//	@Produce	json
//	@Param		categoriaSlug	query		string	true	"Slug da categoria"
//	@Param		temporada		query		string	true	"Temporada"
//	@Success	200				{array}		standingResponse
//	@Failure	400				{object}	map[string]string
//	@Failure	500				{object}	map[string]string
//	@Router		/standings [get]
func (api *API) handleListStandings(c *gin.Context) {
	categoriaSlug := c.Query("categoriaSlug")
	temporada := c.Query("temporada")

	if categoriaSlug == "" || temporada == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "categoriaSlug and temporada are required"})
		return
	}

	items, err := api.standingsService.ListByCategoriaAndTemporada(c.Request.Context(), categoriaSlug, temporada)
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list standings"})
		return
	}

	resp := make([]standingResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toStandingResponse(item))
	}

	_ = jsonutils.EncodeJSON(c, http.StatusOK, resp)
}

// handleCreatePilotoTemporada godoc
//
//	@Summary	Cria entrada piloto temporada (admin)
//	@Tags		admin-standings
//	@Accept		json
//	@Produce	json
//	@Param		body	body		standings.CreatePilotoTemporadaReq	true	"Body"
//	@Success	201		{object}	standingResponse
//	@Failure	400		{object}	map[string]any
//	@Failure	401		{object}	map[string]string
//	@Failure	409		{object}	map[string]string
//	@Failure	422		{object}	map[string]string
//	@Failure	500		{object}	map[string]string
//	@Router		/admin/standings [post]
func (api *API) handleCreatePilotoTemporada(c *gin.Context) {
	data, problems, err := jsonutils.DecodeValidJSON[standings.CreatePilotoTemporadaReq](c)
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
	s, err := api.standingsService.Create(c.Request.Context(), data.PilotoCpf, data.Temporada, data.CategoriaSlug, data.EquipeSlug, data.Pontos, data.Vitorias, data.Podios, data.MelhorVolta, data.Posicao)
	if err != nil {
		if errors.Is(err, domain.ErrAlreadyExists) {
			_ = jsonutils.EncodeJSON(c, http.StatusConflict, gin.H{"error": "standing entry already exists"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to create standing"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusCreated, toStandingResponse(s))
}

// handleUpdatePilotoTemporada godoc
//
//	@Summary	Atualiza piloto temporada (admin)
//	@Tags		admin-standings
//	@Accept		json
//	@Produce	json
//	@Param		pilotoCpf		path		string	true	"CPF do piloto"
//	@Param		temporada		path		string	true	"Temporada"
//	@Param		categoriaSlug	path		string	true	"Slug da categoria"
//	@Param		body			body		standings.UpdatePilotoTemporadaReq	true	"Body"
//	@Success	200				{object}	standingResponse
//	@Failure	400				{object}	map[string]any
//	@Failure	401				{object}	map[string]string
//	@Failure	404				{object}	map[string]string
//	@Failure	422				{object}	map[string]string
//	@Failure	500				{object}	map[string]string
//	@Router		/admin/standings/{pilotoCpf}/{temporada}/{categoriaSlug} [put]
func (api *API) handleUpdatePilotoTemporada(c *gin.Context) {
	pilotoCpf := c.Param("pilotoCpf")
	temporada := c.Param("temporada")
	categoriaSlug := c.Param("categoriaSlug")
	if pilotoCpf == "" || temporada == "" || categoriaSlug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "pilotoCpf, temporada and categoriaSlug required"})
		return
	}
	data, problems, err := jsonutils.DecodeValidJSON[standings.UpdatePilotoTemporadaReq](c)
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
	s, err := api.standingsService.Update(c.Request.Context(), pilotoCpf, temporada, categoriaSlug, data.EquipeSlug, data.Pontos, data.Vitorias, data.Podios, data.MelhorVolta, data.Posicao)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "standing not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to update standing"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, toStandingResponse(s))
}

// handleDeletePilotoTemporada godoc
//
//	@Summary	Remove piloto temporada (admin)
//	@Tags		admin-standings
//	@Param		pilotoCpf		path		string	true	"CPF do piloto"
//	@Param		temporada		path		string	true	"Temporada"
//	@Param		categoriaSlug	path		string	true	"Slug da categoria"
//	@Success	204	"No Content"
//	@Failure	401	{object}	map[string]string
//	@Failure	404	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/admin/standings/{pilotoCpf}/{temporada}/{categoriaSlug} [delete]
func (api *API) handleDeletePilotoTemporada(c *gin.Context) {
	pilotoCpf := c.Param("pilotoCpf")
	temporada := c.Param("temporada")
	categoriaSlug := c.Param("categoriaSlug")
	if pilotoCpf == "" || temporada == "" || categoriaSlug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "pilotoCpf, temporada and categoriaSlug required"})
		return
	}
	err := api.standingsService.Delete(c.Request.Context(), pilotoCpf, temporada, categoriaSlug)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "standing not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to delete standing"})
		return
	}
	c.Status(http.StatusNoContent)
}

