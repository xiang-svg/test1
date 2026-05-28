import { useAppContext } from '../../hooks/useAppContext';
import { selectRandomPersonalities } from '../../hooks/useAppContext';
import GlassCard from '../common/GlassCard';

export default function PersonalityPreview() {
  const { state, dispatch } = useAppContext();
  const display = state.selectedPersonalities;

  const handleRefresh = () => {
    const fresh = selectRandomPersonalities(state.chainLength);
    dispatch({ type: 'SET_PERSONALITIES', payload: fresh });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-primary-300">参与传话的 AI 人格</span>
        <button
          className="text-sm text-primary-400 hover:text-primary-300 active:scale-95 transition-all"
          onClick={handleRefresh}
        >
          换一批
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {display.map((p) => (
          <GlassCard key={p.id} className="flex-shrink-0 w-20 text-center !p-3">
            <div className="text-2xl mb-1">{p.emoji}</div>
            <div className="text-xs text-white/80 truncate">{p.name}</div>
          </GlassCard>
        ))}
        {display.length === 0 && (
          <div className="text-white/30 text-sm py-4 text-center w-full">
            点击"换一批"选择 AI 人格
          </div>
        )}
      </div>
    </div>
  );
}
