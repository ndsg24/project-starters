package server

import (
	"example.com/go-api/internal/health"
	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humago"
	"github.com/rs/cors"
	"net/http"
)

func NewHandler(origins ...[]string) http.Handler {
	mux := http.NewServeMux()
	config := huma.DefaultConfig("Go API", "1.0.0")
	config.OpenAPIPath = "/openapi"
	api := humago.New(mux, config)
	health.Register(api)

	allowed := []string{}
	if len(origins) > 0 {
		allowed = origins[0]
	}
	return cors.New(cors.Options{AllowOriginFunc: func(origin string) bool {
		for _, value := range allowed {
			if value == origin {
				return true
			}
		}
		return false
	}, AllowedMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}, AllowedHeaders: []string{"Accept", "Content-Type", "Authorization"}}).Handler(mux)
}
