export interface Script {
  slides: Slide[];
  metadata: unknown;
}

export interface Slide {
  id: number;
  blocks: Block[];
}

export interface Block {
  id: number;
  html: string;
}
