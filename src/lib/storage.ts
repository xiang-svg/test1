import { GameResult } from '../types';

const KEYS = {
  API_KEY: 'driftscript_api_key',
  CUSTOM_PERSONALITIES: 'driftscript_custom_personalities',
  HISTORY: 'driftscript_history',
  SETTINGS: 'driftscript_settings',
} as const;

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

export function getHistory(): GameResult[] {
  return getItem(KEYS.HISTORY, []);
}

export function saveGameResult(result: GameResult): void {
  const history = getHistory();
  history.unshift(result);
  setItem(KEYS.HISTORY, history.slice(0, 20));
}

export function getStoredApiKey(): string {
  return getItem(KEYS.API_KEY, '');
}

export function setStoredApiKey(key: string): void {
  setItem(KEYS.API_KEY, key);
}
