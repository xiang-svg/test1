import { useCallback, useRef } from 'react';
import { useAppContext } from './useAppContext';
import { streamRewrite, scoreDrift } from '../api/deepseek';
import { saveGameResult } from '../lib/storage';
import type { ChainStep, Action } from '../types';

export function useGameEngine() {
  const { state, dispatch } = useAppContext();
  const abortRef = useRef<AbortController | null>(null);

  const runChain = useCallback(async () => {
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;
    const { selectedPersonalities, promptText } = state;
    let currentText = promptText.trim();
    const chain: ChainStep[] = [];

    for (let i = 0; i < selectedPersonalities.length; i++) {
      const p = selectedPersonalities[i];
      dispatch({ type: 'STEP_START', payload: i });
      let fullText = '';

      try {
        for await (const chunk of streamRewrite(p.trait, currentText, signal)) {
          fullText += chunk;
          dispatch({ type: 'STREAMING_TEXT', payload: fullText });
        }
      } catch (err) {
        if (signal.aborted) return;
        dispatch({ type: 'SET_ERROR', payload: `第 ${i + 1} 步出错：${err instanceof Error ? err.message : '未知错误'}` });
        return;
      }

      const step: ChainStep = {
        step: i + 1,
        personality: p.name,
        emoji: p.emoji,
        text: fullText.trim(),
      };
      chain.push(step);
      dispatch({ type: 'STEP_COMPLETE', payload: step });
      currentText = fullText.trim();
    }

    // Score drift
    dispatch({ type: 'SCORING_START' });
    try {
      const score = await scoreDrift(promptText.trim(), currentText, signal);
      dispatch({ type: 'SCORING_COMPLETE', payload: score });

      saveGameResult({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        timestamp: Date.now(),
        initialPrompt: promptText.trim(),
        chain,
        finalDriftScore: score,
      });
    } catch (err) {
      if (signal.aborted) return;
      dispatch({ type: 'SET_ERROR', payload: `评分出错：${err instanceof Error ? err.message : '未知错误'}` });
    }
  }, [state.selectedPersonalities, state.promptText, dispatch]);

  const skipToEnd = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    dispatch({ type: 'RESET' } as Action);
  }, [dispatch]);

  return { runChain, skipToEnd, reset };
}
