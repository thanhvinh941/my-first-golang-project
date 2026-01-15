// cmd/api/main.go
package main

import (
	"log"
	"my-project/backend/internal/common"
	"my-project/backend/internal/pkg/hash"
	"my-project/backend/internal/pkg/jwtutil"
	gormrepo "my-project/backend/internal/repository/gorm"
	service "my-project/backend/internal/services"
	httptransport "my-project/backend/internal/transport/http"
	"my-project/backend/internal/transport/http/middleware"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	_ = godotenv.Load(".env.local")

	// 1) Connect DB (giữ nguyên Postgres/GORM như bài gốc)
	dsn := os.Getenv("DB_DSN") // gợi ý: "host=... user=... password=... dbname=... port=... sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// Auto-migrate models (adapter layer)
	if err := db.AutoMigrate(&gormrepo.UserModel{}, &gormrepo.EntryModel{}); err != nil {
		log.Fatal(err)
	}

	// 2) Repositories
	userRepo := gormrepo.NewUserGorm(db)
	entryRepo := gormrepo.NewEntryGorm(db)

	// 3) Services
	key := []byte(os.Getenv("JWT_PRIVATE_KEY"))
	tokenTTL := 30 * time.Minute // hoặc đọc từ env TOKEN_TTL
	authSvc := service.NewAuthService(userRepo, hash.Bcrypt{}, jwtutil.NewHMAC(key), tokenTTL)
	entrySvc := service.NewEntryService(entryRepo)

	// 1) Load YAML config (optional: replace with your own config loader)
	providers, server, err := common.LoadConfigYAML("config.yaml")
	if err != nil {
		log.Fatalf("load config: %v", err)
	}

	// 2) Build the factory (will fallback source to MAS and add logging headers)
	factory := common.NewRestClientFactory(providers, server, nil)

	// 3) Build the endpoint resolver (MARKET/TRADING/FOREIGN/STATIC_DATA)
	resolver := common.NewStaticEndpointResolver()

	callSvc := common.NewCallApiService(factory, resolver)

	symbolSvc := service.NewExternalSymbolService(callSvc)

	// 4) HTTP
	r := gin.Default()
	authH := httptransport.NewAuthHandler(authSvc)
	entryH := httptransport.NewEntryHandler(entrySvc)
	symbolH := httptransport.NewSymbolHandler(symbolSvc)

	// Routes
	auth := r.Group("/auth")
	{
		auth.POST("/register", authH.Register)
		auth.POST("/login", authH.Login)
	}

	api := r.Group("/api", middleware.JWTAuth(jwtutil.NewHMAC(key)))
	{
		api.POST("/entries", entryH.Create)
		api.GET("/entries", entryH.ListMine)
	}

	symbol := r.Group("/symbol")
	{
		symbol.GET("/get-all", symbolH.GetSymbolStaticData)
	}

	log.Println("Server running on :8000")
	_ = r.Run(":8000")
}
