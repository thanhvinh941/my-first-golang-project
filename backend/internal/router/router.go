package router

import (
	"github.com/gin-gonic/gin"
)

type Handler interface {
	Register(rg *gin.RouterGroup)
}

type ModuleRouter struct {
	Handler Handler
}

func New(modules ...ModuleRouter) *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")

	for _, m := range modules {
		if m.Handler == nil {
			continue
		}
		m.Handler.Register(api)
	}

	return r
}
