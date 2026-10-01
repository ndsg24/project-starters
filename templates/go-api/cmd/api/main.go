package main

import (
	"context"
	"errors"
	"example.com/go-api/internal/server"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	server := &http.Server{Addr: ":" + port, Handler: server.NewHandler(), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 10 * time.Second, IdleTimeout: 60 * time.Second}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	go func() {
		<-ctx.Done()
		shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := server.Shutdown(shutdown); err != nil {
			log.Printf("shutdown: %v", err)
		}
	}()
	log.Printf("listening on %s", server.Addr)

	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
