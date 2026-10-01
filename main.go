package main

func main() {
	script, err := ParseScript("script.md")
	if err != nil {
		panic(err)
	}

	StartServer(*script)
}
