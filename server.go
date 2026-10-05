package main

import (
	"context"
	"embed"
	"encoding/json"
	"log"
	"net/http"

	"github.com/labstack/echo/v5"
	"golang.org/x/net/websocket"
)

//go:embed frontend/dist
var embeddedFrontend embed.FS

const hostAddress = "127.0.0.1:7700"

func StartServer(script Script) {
	e := echo.New()
	hub := NewWSHub(PresentationPosition{BlockID: 0})

	e.GET("/state.json", func(c *echo.Context) error {
		return c.JSON(http.StatusOK, PresentationState{
			Script:         script,
			CurrentBlockId: hub.Position().BlockID,
		})
	})
	e.GET("/ws", func(c *echo.Context) error {
		websocket.Handler(func(ws *websocket.Conn) {
			hub.Add(ws)

			defer func() {
				hub.Remove(ws)
				ws.Close()
			}()

			for {
				var raw string

				if err := websocket.Message.Receive(ws, &raw); err != nil {
					return
				}

				var state PresentationPosition
				if err := json.Unmarshal([]byte(raw), &state); err != nil {
					continue
				}

				hub.UpdatePosition(state)
				hub.Broadcast(ws, []byte(raw))
			}
		}).ServeHTTP(c.Response(), c.Request())

		return nil
	})
	e.StaticFS("/", echo.MustSubFS(embeddedFrontend, "frontend/dist"))

	pdfFile, ok := script.Metadata["pdf"].(string)
	if ok && pdfFile != "" {
		e.File("/slides.pdf", pdfFile)
	} else {
		e.GET("/slides.pdf", func(c *echo.Context) error {
			return c.String(http.StatusFailedDependency, "No presentation file specified")
		})
	}

	log.Printf("Starting server: http://%s", hostAddress)
	sc := echo.StartConfig{Address: hostAddress, HideBanner: true, HidePort: true}
	if err := sc.Start(context.Background(), e); err != nil {
		log.Printf("Failed to start server: %v", err)
	}
}
