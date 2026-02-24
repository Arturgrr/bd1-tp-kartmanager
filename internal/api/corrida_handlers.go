package api

import (
	"errors"
	"net/http"
	"time"

	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type corridaResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Date        string `json:"date"`
	Track       string `json:"track"`
	CategoryID  string `json:"categoryId"`
	Season      string `json:"season"`
	Status      string `json:"status"`
}

func toCorridaResponse(corrida pgstore.Corrida) corridaResponse {
	var dateString string
	if corrida.Data.Valid {
		dateString = corrida.Data.Time.Format(time.RFC3339)
	}

	return corridaResponse{
		ID:         corrida.Slug,
		Name:       corrida.Nome,
		Slug:       corrida.Slug,
		Date:       dateString,
		Track:      corrida.Pista,
		CategoryID: corrida.CategoriaSlug,
		Season:     corrida.Temporada,
		Status:     corrida.Status,
	}
}

// handleListCorridas godoc
//
//	@Summary	Lista todas as corridas
//	@Tags		corridas
//	@Produce	json
//	@Success	200	{array}		corridaResponse
//	@Failure	500	{object}	map[string]string
//	@Router		/corridas [get]
func (api *API) handleListCorridas(c *gin.Context) {
	list, err := api.corridaService.List(c.Request.Context())
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list races"})
		return
	}
	resp := make([]corridaResponse, 0, len(list))
	for _, item := range list {
		resp = append(resp, toCorridaResponse(item))
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, resp)
}

// handleGetCorridaBySlug godoc
//
//	@Summary	Busca corrida por slug
//	@Tags		corridas
//	@Produce	json
//	@Param		slug	path		string	true	"Slug da corrida"
//	@Success	200	{object}	corridaResponse
//	@Failure	400	{object}	map[string]string
//	@Failure	404	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/corridas/{slug} [get]
func (api *API) handleGetCorridaBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		_ = jsonutils.EncodeJSON(c, http.StatusBadRequest, gin.H{"error": "slug required"})
		return
	}
	race, err := api.corridaService.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			_ = jsonutils.EncodeJSON(c, http.StatusNotFound, gin.H{"error": "race not found"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to get race"})
		return
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, toCorridaResponse(race))
}

// handleListCorridasCompleted godoc
//
//	@Summary	Lista corridas finalizadas
//	@Tags		corridas
//	@Produce	json
//	@Success	200	{array}		corridaResponse
//	@Failure	500	{object}	map[string]string
//	@Router		/corridas/completed [get]
func (api *API) handleListCorridasCompleted(c *gin.Context) {
	list, err := api.corridaService.ListCompleted(c.Request.Context())
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list completed races"})
		return
	}
	resp := make([]corridaResponse, 0, len(list))
	for _, item := range list {
		resp = append(resp, toCorridaResponse(item))
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, resp)
}

// handleListCorridasUpcoming godoc
//
//	@Summary	Lista corridas futuras
//	@Tags		corridas
//	@Produce	json
//	@Success	200	{array}		corridaResponse
//	@Failure	500	{object}	map[string]string
//	@Router		/corridas/upcoming [get]
func (api *API) handleListCorridasUpcoming(c *gin.Context) {
	list, err := api.corridaService.ListUpcoming(c.Request.Context())
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list upcoming races"})
		return
	}
	resp := make([]corridaResponse, 0, len(list))
	for _, item := range list {
		resp = append(resp, toCorridaResponse(item))
	}
	_ = jsonutils.EncodeJSON(c, http.StatusOK, resp)
}

