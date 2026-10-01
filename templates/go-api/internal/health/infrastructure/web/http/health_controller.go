package http

import (
	"context"
	"example.com/go-api/internal/health/application/usecases"
	"example.com/go-api/internal/health/infrastructure/mappers"
	"example.com/go-api/internal/health/infrastructure/web/http/dtos/responses"
	"github.com/danielgtaylor/huma/v2"
	"net/http"
)

func Register(api huma.API, query usecases.GetHealth) {
	huma.Register(api, huma.Operation{
		OperationID: "getHealth",
		Method:      http.MethodGet,
		Path:        "/health",
		Summary:     "Estado de la API",
		Tags:        []string{"health"},
	},
		func(ctx context.Context, input *struct{}) (*responses.GetHealthResponse, error) {
			return mappers.PresentHealth(query.Execute()), nil
		})
}
