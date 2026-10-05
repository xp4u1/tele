package main

import (
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pkg/browser"
	"golang.org/x/net/websocket"
)

//go:embed frontend/dist
var embeddedFrontend embed.FS

func StartServer(config Config, script Script) {
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
				log.Println("Client disconnected")
			}()

			log.Println("Client connected")

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

	pdfPath, err := script.GetSlidesFile()
	if err != nil {
		e.GET("/slides.pdf", func(c *echo.Context) error {
			return c.String(http.StatusFailedDependency, "No presentation file specified")
		})
	} else {
		e.File("/slides.pdf", *pdfPath)
	}

	sc := echo.StartConfig{Address: config.Server.Address, HideBanner: true, HidePort: true, ListenerAddrFunc: func(addr net.Addr) {
		baseURL := "http://" + addr.String()

		fmt.Printf("\nSpeaker view: %s/speaker.html\n", baseURL)
		if pdfPath != nil {
			fmt.Printf("      Slides: %s/slides.html\n", baseURL)
		}
		fmt.Println("")

		if config.Server.OpenBrowser {
			browser.OpenURL(baseURL + "/speaker.html")
			browser.OpenURL(baseURL + "/slides.html")
		}
	}}

	if err := sc.Start(context.Background(), e); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
	}
}
