package server

import (
	"example.com/go-api/internal/health"
	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humago"
	"net/http"
)

func NewHandler() http.Handler {
	mux := http.NewServeMux()
	config := huma.DefaultConfig("Go API", "1.0.0")
	config.OpenAPIPath = "/openapi"
	api := humago.New(mux, config)
	health.Register(api)
	return mux
}
