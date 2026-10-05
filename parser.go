package main

import (
	"bytes"
	"log"
	"os"

	meta "github.com/yuin/goldmark-meta/v2"
	"github.com/yuin/goldmark/v2/ast"
	"github.com/yuin/goldmark/v2/parser"
	"github.com/yuin/goldmark/v2/renderer/html"
)

var p = parser.New(
	parser.WithExtensions(
		meta.Parser,
	),
)
var r = html.New()

func ParseScript(path string) (*Script, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	document := p.Parse(content)
	metadata := document.(*ast.Document).Metadata()

	blocks := []Block{}

	slideIndex := 0
	blockIndex := 0

	for child := range document.Children() {
		switch child.Kind().String() {
		case "Paragraph":
			var buf bytes.Buffer

			if err := r.Render(&buf, content, child); err != nil {
				return nil, err
			}

			blocks = append(blocks, Block{
				BlockId: blockIndex,
				SlideId: slideIndex,
				HTML:    buf.String(),
			})

			blockIndex++

		case "ThematicBreak":
			slideIndex++
		}
	}

	log.Printf(
		"Parsed script with %d slides (%d text blocks)",
		slideIndex+1,
		blockIndex,
	)

	return &Script{
		Block:    blocks,
		Metadata: metadata,
	}, nil
}
