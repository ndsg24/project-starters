package main

import (
	"context"
	"example.com/go-api/internal/platform/config"
	"example.com/go-api/internal/platform/database"
	"log"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}
	pool, err := database.Connect(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()
	var connected int
	if err := pool.QueryRow(context.Background(), "SELECT 1").Scan(&connected); err != nil || connected != 1 {
		log.Fatal("PostgreSQL connection check failed")
	}
	log.Print("PostgreSQL connection PASS; no business tables or records created")
}
