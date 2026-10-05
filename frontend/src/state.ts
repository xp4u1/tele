import type { PresentationState, Script } from "./types";

export type StateChangeSource = "local" | "remote";

export type Listener = (
  state: PresentationState,
  source: StateChangeSource,
) => void;

let state: PresentationState = {
  script: {
    blocks: [],
    metadata: undefined,
  },
  currentBlockId: 0,
};

const listeners = new Set<Listener>();

const notify = (source: StateChangeSource) => {
  listeners.forEach((listener) => listener(state, source));
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const presentationState = {
  get currentBlockId() {
    return state.currentBlockId;
  },

  get maxBlockId() {
    return Math.max(state.script.blocks.length - 1, 0);
  },

  goTo(blockId: number) {
    state.currentBlockId = clamp(blockId, 0, this.maxBlockId);
    notify("local");
  },

  next() {
    this.goTo(this.currentBlockId + 1);
  },

  previous() {
    this.goTo(this.currentBlockId - 1);
  },

  reset() {
    this.goTo(0);
  },

  applyRemote(blockId: number) {
    state.currentBlockId = clamp(blockId, 0, this.maxBlockId);
    notify("remote");
  },

  init(script: Script, currentBlockId = 0) {
    state = {
      script,
      currentBlockId: clamp(
        currentBlockId,
        0,
        Math.max(script.blocks.length - 1, 0),
      ),
    };

    notify("local");
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
