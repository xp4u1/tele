import { presentationState } from "../state";

export const setupKeyboard = (getBlockCount: () => number) => {
  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "j":
      case "n":
      case " ":
      case "ArrowDown":
        presentationState.next(getBlockCount());
        break;

      case "k":
      case "p":
      case "ArrowUp":
        presentationState.previous();
        break;

      case "Escape":
      case "r":
        presentationState.reset();
        break;
    }
  });
};

export const setupWheel = (getBlockCount: () => number) => {
  window.addEventListener(
    "wheel",
    (event) => {
      if (event.deltaY > 0) {
        presentationState.next(getBlockCount());
      } else if (event.deltaY < 0) {
        presentationState.previous();
      }

      event.preventDefault();
    },
    { passive: false },
  );
};
