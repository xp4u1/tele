import { presentationState } from "../state";

export const setupKeyboard = () => {
  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "j":
      case "n":
      case " ":
      case "ArrowDown":
        presentationState.next();
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

export const setupMouse = () => {
  window.addEventListener(
    "wheel",
    (event) => {
      if (event.deltaY > 0) {
        presentationState.next();
      } else if (event.deltaY < 0) {
        presentationState.previous();
      }

      event.preventDefault();
    },
    { passive: false },
  );
};
