export interface Script {
  blocks: Block[];
  metadata: unknown;
}

export interface Block {
  blockId: number;
  slideId: number;
  html: string;
}

export interface PresentationState {
  script: Script;
  currentBlockId: number;
}

export interface PresentationPosition {
  blockId: number;
}
