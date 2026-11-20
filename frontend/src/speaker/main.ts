import { presentationState } from "../state";
import type { PresentationState } from "../types";
import { setupWebsocket } from "../websocket";
import { setupKeyboard, setupMouse } from "./keyboard";
import { renderBlocks, renderCurrentBlock } from "./rendering";

presentationState.subscribe(renderCurrentBlock);

window.addEventListener("load", async () => {
  try {
    const stateResponse = await fetch("/state.json");
    const state: PresentationState = await stateResponse.json();

    if (state.script.blocks.length === 0) {
      document.querySelector<HTMLElement>("#viewport")!.hidden = true;
      document.querySelector<HTMLElement>("#empty-markdown")!.hidden = false;
      return;
    }

    renderBlocks(state.script);
    presentationState.init(state.script, state.currentBlockId);

    setupKeyboard();
    setupMouse();

    setupWebsocket();
  } catch (error) {
    console.error(error);
  }
});
