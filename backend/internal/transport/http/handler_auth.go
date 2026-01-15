package httptransport

import (
	"my-project/backend/internal/dto"
	service "my-project/backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct{ svc service.AuthService }

func NewAuthHandler(svc service.AuthService) *AuthHandler { return &AuthHandler{svc} }

func (h *AuthHandler) Register(c *gin.Context) {
	var in dto.AuthInputDto
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // validate fail
		return
	}
	u, err := h.svc.Register(c.Request.Context(), in)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"user": gin.H{"id": u.ID, "username": u.Username}})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var in dto.AuthInputDto
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	jwt, err := h.svc.Login(c.Request.Context(), in)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"jwt": jwt})
}
