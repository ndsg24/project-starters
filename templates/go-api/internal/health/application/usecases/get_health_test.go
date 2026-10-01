package usecases

import (
	"testing"
	"time"
)

type fixedClock struct{ now time.Time }

func (clock fixedClock) Now() time.Time { return clock.now }
func TestShouldUseInjectedClock(t *testing.T) {
	now := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)
	result := NewGetHealth(fixedClock{now}).Execute()

	if result.Status != "ok" || !result.CheckedAt.Equal(now) {
		t.Fatalf("unexpected health: %+v", result)
	}
}
