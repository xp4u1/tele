package main

import (
	"log"
	"sync"

	"golang.org/x/net/websocket"
)

type WSHub struct {
	mu       sync.Mutex
	clients  map[*websocket.Conn]struct{}
	position PresentationPosition
}

func NewWSHub(initialPosition PresentationPosition) *WSHub {
	return &WSHub{
		clients:  make(map[*websocket.Conn]struct{}),
		position: initialPosition,
	}
}

func (h *WSHub) Add(conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()

	h.clients[conn] = struct{}{}
}

func (h *WSHub) Remove(conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()

	delete(h.clients, conn)
}

func (h *WSHub) UpdatePosition(state PresentationPosition) {
	h.mu.Lock()
	defer h.mu.Unlock()

	h.position = state
}

func (h *WSHub) Position() PresentationPosition {
	h.mu.Lock()
	defer h.mu.Unlock()

	return h.position
}

func (h *WSHub) Broadcast(sender *websocket.Conn, data []byte) {
	h.mu.Lock()
	defer h.mu.Unlock()

	for client := range h.clients {
		if client == sender {
			continue
		}

		if err := websocket.Message.Send(client, string(data)); err != nil {
			log.Printf("Websocket send failed: %v", err)
		}
	}
}
