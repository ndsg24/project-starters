package usecases

import (
	"example.com/go-api/internal/health/domain/ports/output"
	"example.com/go-api/internal/health/domain/readmodels"
)

type GetHealth struct{ clock output.Clock }

func NewGetHealth(clock output.Clock) GetHealth { return GetHealth{clock: clock} }
func (uc GetHealth) Execute() readmodels.Health {
	return readmodels.Health{Status: "ok", CheckedAt: uc.clock.Now()}
}
