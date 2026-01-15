package httptransport

import (
	service "my-project/backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SymbolHandler struct {
	svc service.IExternalSymbolService
}

func NewSymbolHandler(svc service.IExternalSymbolService) *SymbolHandler { return &SymbolHandler{svc} }

func (h *SymbolHandler) GetSymbolStaticData(c *gin.Context) {
	e, err := h.svc.GetSymbolStaticData(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, e)
}
