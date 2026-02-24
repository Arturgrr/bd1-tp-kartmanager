package api

import (
	"net/http"

	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
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

