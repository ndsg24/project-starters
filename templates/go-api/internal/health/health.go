package health

import (
	"example.com/go-api/internal/health/application/usecases"
	"example.com/go-api/internal/health/infrastructure/adapters"
	healthhttp "example.com/go-api/internal/health/infrastructure/web/http"
	"github.com/danielgtaylor/huma/v2"
)

func Register(api huma.API) {
	healthhttp.Register(api, usecases.NewGetHealth(adapters.SystemClock{}))
}
