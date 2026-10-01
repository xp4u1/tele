export interface Script {
  blocks: Block[];
  metadata: unknown;
}

export interface Block {
  blockId: number;
  slideId: number;
  html: string;
}
