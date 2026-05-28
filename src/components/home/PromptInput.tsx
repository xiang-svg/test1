import { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { generatePrompt } from '../../api/deepseek';

export default function PromptInput() {
  const { state, dispatch } = useAppContext();
  const maxLen = 100;
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const text = await generatePrompt();
      dispatch({ type: 'SET_PROMPT', payload: text.slice(0, maxLen) });
    } catch {
      // silently fail
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="relative">
      <textarea
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-primary-500 transition-colors"
        rows={3}
        maxLength={maxLen}
        placeholder="请输入一句你想传递的话..."
        value={state.promptText}
        onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
      />
      <div className="flex items-center justify-between mt-1">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 disabled:text-white/20 transition-colors"
        >
          <span className="text-sm">{generating ? '⏳' : '✨'}</span>
          {generating ? '生成中...' : 'AI 帮我想一句'}
        </button>
        <span className={`text-xs ${state.promptText.length > 80 ? 'text-red-400' : 'text-white/30'}`}>
          {state.promptText.length}/{maxLen}
        </span>
      </div>
    </div>
  );
}
