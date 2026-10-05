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

    renderBlocks(state.script);
    presentationState.init(state.script, state.currentBlockId);

    setupKeyboard();
    setupMouse();

    setupWebsocket();
  } catch (error) {
    console.error(error);
  }
});
