package httpapi

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealth(t *testing.T) {
	recorder := httptest.NewRecorder()
	NewHandler().ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/health", nil))
	if recorder.Code != http.StatusOK || recorder.Body.String() != `{"status":"ok"}` {
		t.Fatalf("unexpected response: %d %s", recorder.Code, recorder.Body.String())
	}
}

func TestUnknownRoute(t *testing.T) {
	recorder := httptest.NewRecorder()
	NewHandler().ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/missing", nil))
	if recorder.Code != http.StatusNotFound {
		t.Fatalf("got %d", recorder.Code)
	}
}
