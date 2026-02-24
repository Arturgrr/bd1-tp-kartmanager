package api

import (
	"net/http"
	"strconv"

	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
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

