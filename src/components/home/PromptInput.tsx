import { useAppContext } from '../../hooks/useAppContext';

export default function PromptInput() {
  const { state, dispatch } = useAppContext();
  const maxLen = 100;

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
      <span className={`absolute bottom-2 right-3 text-xs ${state.promptText.length > 80 ? 'text-red-400' : 'text-white/30'}`}>
        {state.promptText.length}/{maxLen}
      </span>
    </div>
  );
}
