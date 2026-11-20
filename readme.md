# tele

A teleprompter for markdown files. It can sync with a PDF presentation.

Open as many browser tabs as you like. Each one is a synced teleprompter or slide view: a press of a key in one tab moves all the others.

Each paragraph of the markdown file is revealed one step at a time, and `---` starts a new slide.

## Usage

```sh
# Load a markdown file to start the application
$ tele script.md
```

Once running, tele prints two URLs:

- Speaker view: `http://127.0.0.1:7700/speaker.html`
- Slides: `http://127.0.0.1:7700/slides.html`

Keys:

| Key                    | Action         |
| ---------------------- | -------------- |
| `j`, `n`, `space`, `↓` | next block     |
| `k`, `p`, `↑`          | previous block |
| `r`, `esc`             | reset          |

The mouse wheel also moves forward and back.

## Script

A script is a Markdown file. The front matter names the PDF, relative to the working directory:

```markdown
---
pdf: slides.pdf
---

# Introduction

I wrote this tool so I could give talks from a single Markdown file. Most of it is Go, and the parts that run in the browser are TypeScript.

The result is one binary that serves the web frontend and keeps every view in sync. Nothing else has to be installed on the machine that runs the talk.

---

The frontend is compiled with Vite and embedded into the Go binary with go:embed. At runtime there are no extra files to find, so I can copy the binary to another machine and start it there.

Every tab that is open receives the same position over a WebSocket, so my speaker view and my slides stay in step even when they run on different screens.
```

- The first slide has two paragraphs, so it takes two steps before the second slide starts.
- Only paragraphs are shown. Headings are not rendered as blocks.
- Script slide 1 shows PDF page 1, script slide 2 shows PDF page 2, and so on.

## Configuration

tele creates a configuration file (`config.toml`) on first run in the user config directory:

- Linux: `~/.config/tele/config.toml`
- macOS: `~/Library/Application Support/tele/config.toml`
- Windows: `%AppData%\tele\config.toml`

```toml
[server]
address = "127.0.0.1:7700"
open_browser = false
```

## Development

Requirements: Go, pnpm, [GoReleaser](https://goreleaser.com).

```sh
# build for the current platform into dist/
$ goreleaser build --snapshot --clean --single-target

# build all platforms and archives into dist/
$ goreleaser release --snapshot --clean
```

GoReleaser runs the frontend build first (`pnpm build` in `frontend/`), because the Go binary embeds `frontend/dist`. The frontend is TypeScript and Tailwind, built with Vite.

If you run `go build` directly instead, build the frontend first, or the embed will fail:

```sh
$ cd frontend && pnpm install --frozen-lockfile && pnpm build
$ cd .. && go build .
```
