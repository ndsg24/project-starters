package readmodels

import "time"

type Health struct {
	Status    string
	CheckedAt time.Time
}
