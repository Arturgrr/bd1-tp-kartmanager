package api

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/arturgrr/bd1-kartmanager/internal/domain"
	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/resultado"
	"github.com/gin-gonic/gin"
)

type raceResultResponse struct {
	Position  int32  `json:"position"`
	PilotID   string `json:"pilotId"`
	TeamID    string `json:"teamId"`
	BestLap   string `json:"bestLap"`
	TotalTime string `json:"totalTime"`
	Points    int32  `json:"points"`
}

// handleListResultadosByCorrida godoc
//
//	@Summary	Lista resultados de uma corrida
//	@Tags		resultados
//	@Produce	json
//	@Param		slug	path		string	true	"Slug da corrida"
//	@Success	200	{array}		raceResultResponse
//	@Failure	400	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/corridas/{slug}/resultados [get]
func (api *API) handleListResultadosByCorrida(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}

	results, err := api.resultadoService.ListByCorrida(c.Request.Context(), slug)
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list race results"})
		return
	}

	resp := make([]raceResultResponse, 0, len(results))
	for _, r := range results {
		resp = append(resp, raceResultResponse{
			Position:  r.Posicao,
			PilotID:   r.PilotoCpf,
			TeamID:    r.EquipeSlug,
			BestLap:   r.MelhorVolta,
			TotalTime: r.TempoTotal,
			Points:    r.Pontos,
		})
	}

	_ = jsonutils.EncodeJSON(c, http.StatusOK, resp)
}

// handleCreateResultado godoc
//
//	@Summary	Cria resultado de corrida (admin)
//	@Tags		admin-resultados
//	@Accept		json
//	@Produce	json
//	@Param		slug	path		string	true	"Slug da corrida"
//	@Param		body	body		resultado.CreateResultadoReq	true	"Body"
//	@Success	201		{object}	raceResultResponse
//	@Failure	400		{object}	map[string]any
//	@Failure	401		{object}	map[string]string
//	@Failure	409		{object}	map[string]string
//	@Failure	422		{object}	map[string]string
//	@Failure	500		{object}	map[string]string
//	@Router		/admin/corridas/{slug}/resultados [post]
func (api *API) handleCreateResultado(c *gin.Context) {
	corridaSlug := c.Param("slug")
	if corridaSlug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	data, problems, err := jsonutils.DecodeValidJSON[resultado.CreateResultadoReq](c)
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
	r, err := api.resultadoService.Create(c.Request.Context(), corridaSlug, data.Posicao, data.PilotoCpf, data.EquipeSlug, data.MelhorVolta, data.TempoTotal, data.Pontos)
	if err != nil {
		if errors.Is(err, domain.ErrAlreadyExists) {
			_ = jsonutils.EncodeJSON(c, http.StatusConflict, gin.H{"error": "result already exists for this position"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to create result"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusCreated, raceResultResponse{
		Position:  r.Posicao,
		PilotID:   r.PilotoCpf,
		TeamID:    r.EquipeSlug,
		BestLap:   r.MelhorVolta,
		TotalTime: r.TempoTotal,
		Points:    r.Pontos,
	})
}

// handleUpdateResultado godoc
//
//	@Summary	Atualiza resultado de corrida (admin)
//	@Tags		admin-resultados
//	@Accept		json
//	@Produce	json
//	@Param		slug		path		string	true	"Slug da corrida"
//	@Param		posicao	path		int		true	"Posição"
//	@Param		body		body		resultado.UpdateResultadoReq	true	"Body"
//	@Success	200			{object}	raceResultResponse
//	@Failure	400			{object}	map[string]any
//	@Failure	401			{object}	map[string]string
//	@Failure	404			{object}	map[string]string
//	@Failure	422			{object}	map[string]string
//	@Failure	500			{object}	map[string]string
//	@Router		/admin/corridas/{slug}/resultados/{posicao} [put]
func (api *API) handleUpdateResultado(c *gin.Context) {
	corridaSlug := c.Param("slug")
	if corridaSlug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	posicaoParam := c.Param("posicao")
	posicaoValue, err := strconv.Atoi(posicaoParam)
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "invalid position"})
		return
	}
	posicao := int32(posicaoValue)
	data, problems, err := jsonutils.DecodeValidJSON[resultado.UpdateResultadoReq](c)
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
	r, err := api.resultadoService.Update(c.Request.Context(), corridaSlug, posicao, data.PilotoCpf, data.EquipeSlug, data.MelhorVolta, data.TempoTotal, data.Pontos)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "result not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to update result"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, raceResultResponse{
		Position:  r.Posicao,
		PilotID:   r.PilotoCpf,
		TeamID:    r.EquipeSlug,
		BestLap:   r.MelhorVolta,
		TotalTime: r.TempoTotal,
		Points:    r.Pontos,
	})
}

// handleDeleteResultado godoc
//
//	@Summary	Remove resultado de corrida (admin)
//	@Tags		admin-resultados
//	@Param		slug		path		string	true	"Slug da corrida"
//	@Param		posicao	path		int		true	"Posição"
//	@Success	204	"No Content"
//	@Failure	401	{object}	map[string]string
//	@Failure	404	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/admin/corridas/{slug}/resultados/{posicao} [delete]
func (api *API) handleDeleteResultado(c *gin.Context) {
	corridaSlug := c.Param("slug")
	if corridaSlug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	posicaoParam := c.Param("posicao")
	posicaoValue, err := strconv.Atoi(posicaoParam)
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "invalid position"})
		return
	}
	err = api.resultadoService.Delete(c.Request.Context(), corridaSlug, int32(posicaoValue))
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "result not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to delete result"})
		return
	}
	c.Status(http.StatusNoContent)
}

// handleGetResultadoByCorridaAndPosicao godoc
//
//	@Summary	Busca resultado de uma corrida por posição
//	@Tags		resultados
//	@Produce	json
//	@Param		slug		path		string	true	"Slug da corrida"
//	@Param		posicao	path		int		true	"Posição do piloto"
//	@Success	200	{object}	raceResultResponse
//	@Failure	400	{object}	map[string]string
//	@Failure	404	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/corridas/{slug}/resultados/{posicao} [get]
func (api *API) handleGetResultadoByCorridaAndPosicao(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}

	posicaoParam := c.Param("posicao")
	posicaoValue, err := strconv.Atoi(posicaoParam)
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "invalid position"})
		return
	}

	result, err := api.resultadoService.GetByCorridaAndPosicao(c.Request.Context(), slug, int32(posicaoValue))
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to get race result"})
		return
	}

	resp := raceResultResponse{
		Position:  result.Posicao,
		PilotID:   result.PilotoCpf,
		TeamID:    result.EquipeSlug,
		BestLap:   result.MelhorVolta,
		TotalTime: result.TempoTotal,
		Points:    result.Pontos,
	}

	_ = jsonutils.EncodeJSON(c, http.StatusOK, resp)
}

