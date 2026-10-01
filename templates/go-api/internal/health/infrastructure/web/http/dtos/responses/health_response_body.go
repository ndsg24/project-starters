package responses

import "time"

type HealthResponseBody struct {
	Status    string    `json:"status" enum:"ok"`
	CheckedAt time.Time `json:"checkedAt"`
}
