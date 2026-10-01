type Listener = (currentIndex: number) => void;

let currentIndex = 0;
const listeners = new Set<Listener>();

const notify = () => {
  listeners.forEach((listener) => listener(currentIndex));
};

export const presentationState = {
  get currentBlock() {
    return currentIndex;
  },

  goTo(index: number) {
    currentIndex = index;
    notify();
  },

  next(totalBlockCount: number) {
    currentIndex = Math.min(currentIndex + 1, totalBlockCount - 1);
    notify();
  },

  previous() {
    currentIndex = Math.max(currentIndex - 1, 0);
    notify();
  },

  reset() {
    currentIndex = 0;
    notify();
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
