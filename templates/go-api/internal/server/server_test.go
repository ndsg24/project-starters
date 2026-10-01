package server

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestShouldExposeHealthAndOpenAPI(t *testing.T) {
	handler := NewHandler()
	for _, path := range []string{"/health", "/openapi.json", "/docs"} {
		recorder := httptest.NewRecorder()
		handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, path, nil))
		if recorder.Code != http.StatusOK {
			t.Fatalf("%s: got %d", path, recorder.Code)
		}
		if path == "/health" {
			var body map[string]string
			if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil {
				t.Fatal(err)
			}
			if body["status"] != "ok" || body["checkedAt"] == "" {
				t.Fatalf("unexpected health: %v", body)
			}
		}
		if path == "/openapi.json" {
			var schema struct {
				Paths map[string]struct {
					Get struct {
						OperationID string `json:"operationId"`
					}
				}
			}
			if err := json.Unmarshal(recorder.Body.Bytes(), &schema); err != nil {
				t.Fatal(err)
			}
			if schema.Paths["/health"].Get.OperationID != "getHealth" {
				t.Fatal("health missing from OpenAPI")
			}
		}
	}
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/missing", nil))
	if recorder.Code != http.StatusNotFound {
		t.Fatalf("got %d", recorder.Code)
	}
}
