package architecture

import (
	"go/parser"
	"go/token"
	"io/fs"
	"path/filepath"
	"strconv"
	"strings"
	"testing"
)

func TestShouldKeepDomainAndUseCasesIndependent(t *testing.T) {
	err := filepath.WalkDir("../health", func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		normalized := filepath.ToSlash(path)

		if entry.IsDir() || !strings.HasSuffix(path, ".go") || strings.HasSuffix(path, "_test.go") {
			return nil
		}

		domain := strings.Contains(normalized, "/domain/")
		useCase := strings.Contains(normalized, "/application/usecases/")

		if !domain && !useCase {
			return nil
		}

		file, err := parser.ParseFile(token.NewFileSet(), path, nil, parser.ImportsOnly)

		if err != nil {
			return err
		}

		for _, dependency := range file.Imports {
			name, err := strconv.Unquote(dependency.Path.Value)

			if err != nil {
				return err
			}

			allowed := name == "time" || name == "context" || name == "errors" || name == "fmt" || name == "strings" || name == "math"

			if strings.Contains(name, "/internal/health/domain/") {
				allowed = true
			}

			if !allowed {
				t.Errorf("%s imports forbidden dependency %s", path, name)
			}
		}

		return nil
	})

	if err != nil {
		t.Fatal(err)
	}
}
