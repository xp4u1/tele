package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Printf("Usage: %s <file>\n", os.Args[0])
		os.Exit(1)
	}

	config, err := LoadConfig()
	if err != nil {
		fmt.Printf("Unable to load config: %v\n", err)
		os.Exit(1)
	}

	path := os.Args[1]
	script, err := ParseScript(path)
	if err != nil {
		fmt.Printf("Unable to parse script '%s': %v\n", path, err)
		os.Exit(1)
	}

	StartServer(*config, *script)
}
