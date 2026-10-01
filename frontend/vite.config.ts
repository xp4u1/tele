import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        speaker: path.resolve(import.meta.dirname, "speaker.html"),
        slides: path.resolve(import.meta.dirname, "slides.html"),
      },
    },
  },
});
