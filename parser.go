package main

import (
	"bytes"
	"os"

	meta "github.com/yuin/goldmark-meta/v2"
	"github.com/yuin/goldmark/v2/ast"
	"github.com/yuin/goldmark/v2/parser"
	"github.com/yuin/goldmark/v2/renderer/html"
)

type Script struct {
	Slides   []Slide        `json:"slides"`
	Metadata map[string]any `json:"metadata"`
}

type Slide struct {
	ID     int     `json:"id"`
	Blocks []Block `json:"blocks"`
}

type Block struct {
	// Block id should be unique per Script, not per Slide
	ID   int    `json:"id"`
	HTML string `json:"html"`
}

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

	slides := []Slide{}

	slideIndex := 0
	blockIndex := 0

	currentSlide := Slide{
		ID:     slideIndex,
		Blocks: []Block{},
	}

	for child := range document.Children() {
		switch child.Kind().String() {
		case "Paragraph":
			var buf bytes.Buffer

			if err := r.Render(&buf, content, child); err != nil {
				return nil, err
			}

			currentSlide.Blocks = append(currentSlide.Blocks, Block{
				ID:   blockIndex,
				HTML: buf.String(),
			})

			blockIndex++
		case "ThematicBreak":
			slides = append(slides, currentSlide)

			slideIndex++
			// do not reset block index

			currentSlide = Slide{
				ID:     slideIndex,
				Blocks: []Block{},
			}
		}
	}

	if len(currentSlide.Blocks) > 0 {
		slides = append(slides, currentSlide)
	}

	return &Script{
		Slides:   slides,
		Metadata: metadata,
	}, nil
}
