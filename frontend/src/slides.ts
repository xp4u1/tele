import type { Block, Script } from "./types";

const blockContainer = document.querySelector(
  "#block-container",
)! as HTMLElement;
const templateBlock = document.querySelector("#template-block")! as HTMLElement;

const addBlock = (block: Block, slideId: number) => {
  const element = templateBlock.cloneNode(true) as HTMLElement;

  element.dataset.slideId = slideId.toString();
  element.dataset.blockId = block.id.toString();
  element.innerHTML = block.html;

  blockContainer.appendChild(element);
};

const renderBlocks = (script: Script) => {
  blockContainer.replaceChildren();
  script.slides.forEach((slide) => {
    slide.blocks.forEach((block) => addBlock(block, slide.id));
  });
};

const moveTo = (block: HTMLElement) => {
  const blockTop = block.offsetTop;
  blockContainer.style.transform = `translateY(-${blockTop}px)`;
};

const focusBlock = (blockId: number) => {
  const blocks = document.querySelectorAll("[data-block-id]");

  for (let index = 0; index < blocks.length; index++) {
    const element = blocks[index];
    element.classList.remove("previous", "current", "next", "future");

    if (index < blockId) {
      element.classList.add("previous");
    } else if (index === blockId) {
      element.classList.add("current");
    } else if (index === blockId + 1) {
      element.classList.add("next");
    } else {
      element.classList.add("future");
    }
  }

  moveTo(blocks[blockId] as HTMLElement);
};

let current = 0;
setInterval(() => focusBlock(current++ % 4), 1000);

window.addEventListener("load", () => {
  fetch("/api/script")
    .then(async (response) => {
      renderBlocks(await response.json());
      focusBlock(0);
    })
    .catch((error) => console.error(error));
});
