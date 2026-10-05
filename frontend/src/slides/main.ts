import { presentationState } from "../state";
import type { PresentationState } from "../types";
import { setupWebsocket } from "../websocket";
import { createPdfPresentation } from "./pdf";

window.addEventListener("load", async () => {
  try {
    const stateResponse = await fetch("/state.json");
    const state: PresentationState = await stateResponse.json();

    const pdfPresentation = createPdfPresentation(
      document.querySelector<HTMLCanvasElement>("#slide-container")!,
      document.querySelector<HTMLCanvasElement>("#slide")!,
    );
    await pdfPresentation.load("/slides.pdf");

    presentationState.subscribe((state, _source) => {
      const block = state.script.blocks[state.currentBlockId];
      pdfPresentation.goTo(block.slideId);
    });
    window.addEventListener("resize", pdfPresentation.rerender);

    presentationState.init(state.script, state.currentBlockId);
    setupWebsocket();
  } catch (error) {
    console.error(error);
  }
});
