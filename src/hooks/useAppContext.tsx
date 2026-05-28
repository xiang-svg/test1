import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { AppState, Action, Page, Personality } from '../types';
import { shuffle } from '../lib/shuffle';
import { personalities } from '../data/personalities';

const initialState: AppState = {
  page: 'home',
  promptText: '',
  selectedPersonalities: [],
  chainLength: 6,
  chain: [],
  currentStep: 0,
  isStreaming: false,
  streamingText: '',
  driftScore: null,
  isScoring: false,
  error: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, promptText: action.payload };
    case 'SET_PERSONALITIES':
      return { ...state, selectedPersonalities: action.payload };
    case 'SET_CHAIN_LENGTH':
      return { ...state, chainLength: action.payload };
    case 'START_GAME': {
      const selected = state.selectedPersonalities.length > 0
        ? state.selectedPersonalities
        : shuffle(personalities).slice(0, state.chainLength);
      return {
        ...state,
        page: 'game',
        selectedPersonalities: selected,
        chain: [],
        currentStep: 0,
        isStreaming: false,
        streamingText: '',
        driftScore: null,
        isScoring: false,
        error: null,
      };
    }
    case 'STEP_START':
      return { ...state, currentStep: action.payload, isStreaming: true, streamingText: '' };
    case 'STREAMING_TEXT':
      return { ...state, streamingText: action.payload };
    case 'STEP_COMPLETE':
      return {
        ...state,
        chain: [...state.chain, action.payload],
        isStreaming: false,
        streamingText: '',
      };
    case 'SCORING_START':
      return { ...state, isScoring: true };
    case 'SCORING_COMPLETE':
      return { ...state, driftScore: action.payload, isScoring: false, page: 'result' };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isStreaming: false, isScoring: false };
    case 'RESET':
      return { ...initialState, page: 'home' as Page };
    case 'GO_SETTINGS':
      return { ...state, page: 'settings' as Page };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export function selectRandomPersonalities(count: number): Personality[] {
  return shuffle(personalities).slice(0, count);
}
