package api

import (
	"net/http"

	"github.com/arturgrr/bd1-kartmanager/internal/jsonutils"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func AdminAuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		email := session.Get(sessionKeyAdminEmail)
		if email == nil || email == "" {
			_ = jsonutils.EncodeJSON(c, http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
		c.Next()
	}
}
