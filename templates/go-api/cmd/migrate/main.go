package main

import (
	"errors"
	"example.com/go-api/internal/platform/config"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"log"
	"os"
	"path/filepath"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}
	if len(os.Args) != 2 || (os.Args[1] != "up" && os.Args[1] != "down") {
		log.Fatal("use up or down")
	}
	files, err := filepath.Glob("migrations/*.up.sql")
	if err != nil {
		log.Fatal("cannot read migrations")
	}
	if len(files) == 0 {
		log.Print("No SQL migrations configured yet")
		return
	}
	runner, err := migrate.New("file://migrations", cfg.DatabaseURL)
	if err != nil {
		log.Fatal("cannot initialize migrations; check configuration")
	}
	defer runner.Close()
	switch os.Args[1] {
	case "up":
		err = runner.Up()
	case "down":
		err = runner.Steps(-1)
	default:
		log.Fatal("use up or down")
	}
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		log.Fatal("migration failed; inspect schema and migration state")
	}
	log.Print("Migration command complete")
}
