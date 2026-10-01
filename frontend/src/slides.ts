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

window.addEventListener("load", () => {
  fetch("/api/script")
    .then(async (response) => {
      renderBlocks(await response.json());
      focusBlock(0);
    })
    .catch((error) => console.error(error));
});

let currentBlock = 0;
window.addEventListener("keydown", (event) => {
  const blocks = document.querySelectorAll("[data-block-id]");

  switch (event.key) {
    case "j":
    case "n":
    case " ":
    case "ArrowDown":
      currentBlock = Math.min(currentBlock + 1, blocks.length - 1);
      break;
    case "k":
    case "p":
    case "ArrowUp":
      currentBlock = Math.max(currentBlock - 1, 0);
      break;
  }

  focusBlock(currentBlock);
  event.preventDefault();
});

window.addEventListener(
  "wheel",
  (event) => {
    const blocks = document.querySelectorAll("[data-block-id]");

    if (event.deltaY > 0) {
      currentBlock = Math.min(currentBlock + 1, blocks.length - 1);
    } else if (event.deltaY < 0) {
      currentBlock = Math.max(currentBlock - 1, 0);
    }

    focusBlock(currentBlock);
    event.preventDefault();
  },
  { passive: false },
);
