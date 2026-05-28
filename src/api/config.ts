import { getStoredApiKey } from '../lib/storage';

const DEFAULT_API_KEY = 'sk-696341d93c784118afc87b0537532d21';

export function getApiKey(): string {
  return getStoredApiKey() || DEFAULT_API_KEY;
}
