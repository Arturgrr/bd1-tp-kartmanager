package api

import (
	"errors"
	"net/http"

	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/arturgrr/bd1-kartmanager/internal/store/pgstore"
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
