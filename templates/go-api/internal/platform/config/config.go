package config

import (
	"errors"
	"github.com/joho/godotenv"
	"net/url"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	DatabaseURL string
	Port        string
	Host        string
	CORSOrigins []string
}

func Load() (Config, error) {
	if err := godotenv.Load(); err != nil && !os.IsNotExist(err) {
		return Config{}, errors.New("cannot load .env")
	}
	cfg := Config{DatabaseURL: os.Getenv("DATABASE_URL"), Port: os.Getenv("PORT"), Host: os.Getenv("HOST")}
	parsed, err := url.Parse(cfg.DatabaseURL)
	if err != nil || cfg.DatabaseURL == "" || (parsed.Scheme != "postgres" && parsed.Scheme != "postgresql") {
		return Config{}, errors.New("DATABASE_URL must be a PostgreSQL URL; run pnpm setup")
	}
	if cfg.Port == "" {
		cfg.Port = "4000"
	}
	if cfg.Host == "" {
		cfg.Host = "127.0.0.1"
	}
	port, err := strconv.Atoi(cfg.Port)
	if err != nil || port < 1 || port > 65535 {
		return Config{}, errors.New("PORT must be between 1 and 65535")
	}
	for _, value := range strings.Split(os.Getenv("CORS_ORIGINS"), ",") {
		origin := strings.TrimSpace(value)
		if origin == "" {
			continue
		}
		parsed, err := url.Parse(origin)
		if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") || parsed.Host == "" || parsed.User != nil || parsed.Path != "" || parsed.RawQuery != "" || parsed.Fragment != "" {
			return Config{}, errors.New("CORS_ORIGINS must contain explicit HTTP origins")
		}
		cfg.CORSOrigins = append(cfg.CORSOrigins, origin)
	}
	return cfg, nil
}
