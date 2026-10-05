import { presentationState, type StateChangeSource } from "../state";
import type { PresentationState, Script } from "../types";

const blockContainer = document.querySelector(
  "#block-container",
)! as HTMLElement;

const templateBlock = document.querySelector("#template-block")! as HTMLElement;

export const renderBlocks = (script: Script) => {
  blockContainer.replaceChildren();

  script.blocks.forEach((block) => {
    const element = templateBlock.cloneNode(true) as HTMLElement;

    element.dataset.slideId = String(block.slideId);
    element.dataset.blockId = String(block.blockId);
    element.innerHTML = block.html;
    element.addEventListener("click", () =>
      presentationState.goTo(block.blockId),
    );

    blockContainer.appendChild(element);
  });
};

export const renderCurrentBlock = (
  state: PresentationState,
  _source: StateChangeSource,
) => {
  const currentBlock = state.currentBlockId;
  const blocks = document.querySelectorAll<HTMLElement>("[data-block-id]");

  blocks.forEach((element, index) => {
    element.classList.remove("previous", "current", "next", "future");

    if (index < currentBlock) {
      element.classList.add("previous");
    } else if (index === currentBlock) {
      element.classList.add("current");
    } else if (index === currentBlock + 1) {
      element.classList.add("next");
    } else {
      element.classList.add("future");
    }
  });

  const current = blocks[currentBlock];

  if (current) {
    blockContainer.style.transform = `translateY(-${current.offsetTop}px)`;
  }
};
