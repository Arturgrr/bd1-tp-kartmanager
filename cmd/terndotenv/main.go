package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/joho/godotenv"
)

func execTernCommand(args ...string) ([]byte, error) {
	configPath := ""
	for i, arg := range args {
		if arg == "--config" && i+1 < len(args) {
			configPath = args[i+1]
			break
		}
	}

	if configPath == "" {
		return nil, fmt.Errorf("argumento --config não encontrado")
	}

	configTemplate, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("falha ao ler %s: %w", configPath, err)
	}

	resolvedConfig := os.ExpandEnv(string(configTemplate))

	tmpFile, err := os.CreateTemp("", "tern-*.conf")
	if err != nil {
		return nil, fmt.Errorf("falha ao criar arquivo temporário: %w", err)
	}
	defer os.Remove(tmpFile.Name())

	if err := os.WriteFile(tmpFile.Name(), []byte(resolvedConfig), 0644); err != nil {
		return nil, fmt.Errorf("falha ao escrever no arquivo temporário: %w", err)
	}

	for i, arg := range args {
		if arg == "--config" {
			args[i+1] = tmpFile.Name()
			break
		}
	}

	cmd := exec.Command("tern", args...)
	cmd.Env = os.Environ() 
	return cmd.CombinedOutput()
}
func main() {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	output, err := execTernCommand(
		"migrate",
		"--migrations",
		"./internal/store/pgstore/migrations",
		"--config",
		"./internal/store/pgstore/migrations/tern.conf",
	)

	if err != nil {
		fmt.Println("Command execution failed: ", err)
		fmt.Println("Output: ", string(output))
		panic(err)
	}

	fmt.Println("Command executed successfully: ", string(output))
}
