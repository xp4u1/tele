package main

import (
	"context"
	"embed"
	"io/fs"
	"net/http"

	"github.com/labstack/echo/v5"
)

//go:embed frontend/dist
var embeddedFrontend embed.FS

func StartServer() {
	e := echo.New()

	dist, err := fs.Sub(embeddedFrontend, "frontend/dist")
	if err != nil {
		e.Logger.Error("failed to load embedded files", "error", err)
	}
	assetHandler := http.FileServer(http.FS(dist))

	e.GET("/*", echo.WrapHandler(assetHandler))

	sc := echo.StartConfig{Address: "127.0.0.1:7700", HideBanner: true}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
