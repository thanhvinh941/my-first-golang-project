package user

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	svc *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{svc: s}
}

func (h *Handler) Register(rg *gin.RouterGroup) {
	rg.POST("/users", h.create)
	rg.GET("/users", h.list)
	rg.DELETE("/users/:id", h.delete)
}

func (h *Handler) create(c *gin.Context) {
	var u User
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	h.svc.Create(c, &u)
	c.JSON(http.StatusCreated, u)
}

func (h *Handler) list(c *gin.Context) {
	users, _ := h.svc.List(c)
	c.JSON(http.StatusOK, users)
}

func (h *Handler) delete(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	h.svc.Delete(c, id)
	c.Status(http.StatusNoContent)
}
