type Listener = (currentIndex: number) => void;

let currentIndex = 0;
let maxIndex = 0;
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

  next() {
    currentIndex = Math.min(currentIndex + 1, maxIndex - 1);
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

  init(max: number) {
    maxIndex = max;
    this.reset();
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
