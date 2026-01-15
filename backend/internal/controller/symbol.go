package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllSymbol(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{"jwt": jwt})
}
