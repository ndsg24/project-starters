package mappers

import (
	"example.com/go-api/internal/health/domain/readmodels"
	"example.com/go-api/internal/health/infrastructure/web/http/dtos/responses"
)

func PresentHealth(model readmodels.Health) *responses.GetHealthResponse {
	return &responses.GetHealthResponse{Body: responses.HealthResponseBody{Status: model.Status, CheckedAt: model.CheckedAt}}
}
