import { presentationState } from "../state";
import type { Script } from "../types";
import { setupKeyboard, setupMouse } from "./keyboard";
import { renderBlocks, renderCurrentBlock } from "./rendering";

presentationState.subscribe(renderCurrentBlock);

window.addEventListener("load", async () => {
  try {
    const response = await fetch("/api/script");
    const script: Script = await response.json();

    renderBlocks(script);
    presentationState.init(script.blocks.length);
    renderCurrentBlock(presentationState.currentBlock);

    setupKeyboard();
    setupMouse();
  } catch (error) {
    console.error(error);
  }
});
