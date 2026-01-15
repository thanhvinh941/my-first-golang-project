package middleware

import (
	"my-project/backend/internal/pkg/jwtutil"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func JWTAuth(tm jwtutil.TokenManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		parts := strings.SplitN(auth, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}
		tk, claims, err := tm.Parse(parts[1])
		if err != nil || !tk.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		if idf, ok := claims["id"].(float64); ok {
			c.Set("userID", uint(idf))
		}
		c.Next()
	}
}
