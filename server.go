package main

import (
	"context"
	"embed"
	"io/fs"
	"log"
	"net/http"

	"github.com/labstack/echo/v5"
)

//go:embed frontend/dist
var embeddedFrontend embed.FS

const hostAddress = "127.0.0.1:7700"

func StartServer(script Script) {
	e := echo.New()

	dist, err := fs.Sub(embeddedFrontend, "frontend/dist")
	if err != nil {
		log.Printf("Failed to load embedded files %v", err)
	}
	assetHandler := http.FileServer(http.FS(dist))

	e.GET("/api/script", func(c *echo.Context) error {
		return c.JSON(http.StatusOK, script)
	})
	e.GET("/*", echo.WrapHandler(assetHandler))

	log.Printf("Starting server: http://%s", hostAddress)
	sc := echo.StartConfig{Address: hostAddress, HideBanner: true, HidePort: true}
	if err := sc.Start(context.Background(), e); err != nil {
		log.Printf("Failed to start server: %v", err)
	}
}
