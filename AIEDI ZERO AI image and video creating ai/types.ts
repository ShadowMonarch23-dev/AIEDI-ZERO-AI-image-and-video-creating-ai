
export enum GenStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum GenType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export interface GenJob {
  id: string;
  prompt: string;
  status: GenStatus;
  mediaUrl?: string;
  type: GenType;
  createdAt: number;
  config: {
    aspectRatio: string;
    resolution?: string;
  };
}

export interface GenerationParams {
  prompt: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  startImage?: string; // base64
  type: GenType;
}
