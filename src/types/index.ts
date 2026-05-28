export interface Personality {
  id: string;
  name: string;
  emoji: string;
  trait: string;
  category: string;
  oneLiner: string;
}

export interface ChainStep {
  step: number;
  personality: string;
  emoji: string;
  text: string;
}

export interface GameResult {
  id: string;
  timestamp: number;
  initialPrompt: string;
  chain: ChainStep[];
  finalDriftScore: number;
}

export type Page = 'home' | 'game' | 'result' | 'settings';

export interface AppState {
  page: Page;
  promptText: string;
  selectedPersonalities: Personality[];
  chainLength: number;
  chain: ChainStep[];
  currentStep: number;
  isStreaming: boolean;
  streamingText: string;
  driftScore: number | null;
  isScoring: boolean;
  error: string | null;
}

export type Action =
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_PERSONALITIES'; payload: Personality[] }
  | { type: 'SET_CHAIN_LENGTH'; payload: number }
  | { type: 'START_GAME' }
  | { type: 'STEP_START'; payload: number }
  | { type: 'STREAMING_TEXT'; payload: string }
  | { type: 'STEP_COMPLETE'; payload: ChainStep }
  | { type: 'SCORING_START' }
  | { type: 'SCORING_COMPLETE'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' }
  | { type: 'GO_SETTINGS' };
