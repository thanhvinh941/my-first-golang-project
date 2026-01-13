package common

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CallAPIRequest struct {
	UserID int    `json:"userId"`
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Body   string `json:"body"`
}

func get(c *gin.Context) {
	response, err := http.Get("jsonplaceholder.typicode.com")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to make external request"})
		return
	}
	// Ensure the response body is closed after the function returns
	defer response.Body.Close()

	// Check if the external request was successful (HTTP Status 200 OK)
	if response.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadGateway, gin.H{"error": "External API returned non-OK status"})
		return
	}

	// 2. Read the response body
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response body"})
		return
	}

	// 3. Unmarshal the JSON response into our Go struct
	var post Post
	err = json.Unmarshal(body, &post)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse external API response"})
		return
	}

	// 4. Return the data to the client using Gin's JSON rendering
	// You can add your own business logic here before returning
	c.JSON(http.StatusOK, gin.H{
		"message": "Data fetched successfully from external API",
		"data":    post,
	})
}
