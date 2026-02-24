package api

import (
	"errors"
	"net/http"

	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/arturgrr/bd1-kartmanager/internal/use-cases/admin"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

const sessionKeyAdminEmail = "admin_email"

// handleLoginAdmin godoc
//
//	@Summary	Login admin
//	@Tags		admin
//	@Accept		json
//	@Produce	json
//	@Param		body	body		admin.LoginAdminReq	true	"Email e senha"
//	@Success	200		{object}	map[string]string
//	@Failure	400		{object}	map[string]any
//	@Failure	422		{object}	map[string]string
//	@Failure	500		{object}	map[string]string
//	@Router		/admin/login [post]
func (api *API) handleLoginAdmin(c *gin.Context) {
	data, problems, err := jsonutils.DecodeValidJSON[admin.LoginAdminReq](c)
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

	email, err := api.adminService.Authenticate(c.Request.Context(), data.Email, data.Password)
	if err != nil {
		if errors.Is(err, admin.ErrInvalidCredentials) {
			_ = jsonutils.EncodeJSON(c, http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
			return
		}
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to authenticate"})
		return
	}

	session := sessions.Default(c)
	session.Set(sessionKeyAdminEmail, email)
	if err := session.Save(); err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to save session"})
		return
	}

	_ = jsonutils.EncodeJSON(c, http.StatusOK, gin.H{"message": "logged in successfully", "email": email})
}

type adminSummaryResponse struct {
	Categorias int `json:"categorias"`
	Equipes    int `json:"equipes"`
	Pilotos    int `json:"pilotos"`
	Corridas   int `json:"corridas"`
	Standings  int `json:"standings"`
}

// handleAdminSummary godoc
//
//	@Summary	Resumo do dashboard admin (contagens)
//	@Tags		admin
//	@Produce	json
//	@Success	200	{object}	adminSummaryResponse
//	@Failure	401	{object}	map[string]string
//	@Failure	500	{object}	map[string]string
//	@Router		/admin/summary [get]
func (api *API) handleAdminSummary(c *gin.Context) {
	ctx := c.Request.Context()
	out := adminSummaryResponse{}
	cat, err := api.categoriaService.List(ctx)
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list categories"})
		return
	}
	out.Categorias = len(cat)
	equ, err := api.equipeService.List(ctx)
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list equipes"})
		return
	}
	out.Equipes = len(equ)
	pil, err := api.pilotoService.List(ctx)
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list pilotos"})
		return
	}
	out.Pilotos = len(pil)
	cor, err := api.corridaService.List(ctx)
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to list corridas"})
		return
	}
	out.Corridas = len(cor)
	staCount, err := api.standingsService.Count(ctx)
	if err != nil {
		_ = jsonutils.EncodeJSON(c, http.StatusInternalServerError, gin.H{"error": "failed to count standings"})
		return
	}
	out.Standings = int(staCount)
	_ = jsonutils.EncodeJSON(c, http.StatusOK, out)
}
