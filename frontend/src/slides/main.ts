import { presentationState } from "../state";
import type { PresentationState } from "../types";
import { setupWebsocket } from "../websocket";

window.addEventListener("load", async () => {
  try {
    const stateResponse = await fetch("/state.json");
    const state: PresentationState = await stateResponse.json();

    const currentSlideSpan: HTMLElement =
      document.querySelector("#current-slide")!;
    presentationState.subscribe((state, _source) => {
      const block = state.script.blocks[state.currentBlockId];
      const slideId = block?.slideId;

      currentSlideSpan.innerText = slideId.toString();
    });

    presentationState.init(state.script, state.currentBlockId);
    setupWebsocket();
  } catch (error) {
    console.error(error);
  }
});
