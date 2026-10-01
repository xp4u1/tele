package main

import "log"

func main() {
	path := "script.md"

	script, err := ParseScript(path)
	if err != nil {
		log.Printf("Unable to parse script '%s'", path)
		panic(err)
	}

	StartServer(*script)
}
