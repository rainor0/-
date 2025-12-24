
export interface TrigValues {
  degree: number;
  radian: number;
  sin: number;
  cos: number;
  tan: number | string;
  cot: number | string;
}

export interface HistoryItem {
  angle: number;
  timestamp: Date;
}

export interface ExplainerResponse {
  concept: string;
  explanation: string;
  examples: string[];
}
