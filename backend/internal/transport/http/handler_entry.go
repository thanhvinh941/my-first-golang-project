package httptransport

import (
	"my-project/backend/internal/dto"
	service "my-project/backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type EntryHandler struct{ svc service.EntryService }

func NewEntryHandler(svc service.EntryService) *EntryHandler { return &EntryHandler{svc} }

func (h *EntryHandler) Create(c *gin.Context) {
	var in dto.CreateEntryInputDto
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID := c.GetUint("userID")
	e, err := h.svc.Create(c.Request.Context(), userID, in)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, e)
}

func (h *EntryHandler) ListMine(c *gin.Context) {
	userID := c.GetUint("userID")
	es, err := h.svc.ListMine(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, es)
}
