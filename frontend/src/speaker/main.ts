import { presentationState } from "../state";
import type { Script } from "../types";
import { setupKeyboard, setupWheel } from "./keyboard";
import { renderBlocks, renderCurrentBlock } from "./rendering";

presentationState.subscribe(renderCurrentBlock);

window.addEventListener("load", async () => {
  try {
    const response = await fetch("/api/script");
    const script: Script = await response.json();

    renderBlocks(script);
    presentationState.reset();
    renderCurrentBlock(presentationState.currentBlock);

    setupKeyboard(() => document.querySelectorAll("[data-block-id]").length);
    setupWheel(() => document.querySelectorAll("[data-block-id]").length);
  } catch (error) {
    console.error(error);
  }
});
