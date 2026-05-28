import { useAppContext } from '../../hooks/useAppContext';
import AnimatedScore from '../common/AnimatedScore';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';
import ShareCard from './ShareCard';

export default function ResultPage() {
  const { state, dispatch } = useAppContext();

  const handleCopy = async () => {
    const lines = [
      `📝 原话：${state.promptText}`,
      '',
      ...state.chain.map((s) => `${s.emoji} ${s.personality}：${s.text}`),
      '',
      `🎯 漂移分数：${state.driftScore}%`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      alert('已复制到剪贴板！');
    } catch {
      // fallback: do nothing
    }
  };

  const handleReplay = () => {
    dispatch({ type: 'RESET' });
  };

  if (state.driftScore === null) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-primary-300">传话结束</h2>
      </div>

      <GlassCard>
        <AnimatedScore target={state.driftScore} />
      </GlassCard>

      <div>
        <h3 className="text-sm text-primary-300 mb-3">传递链条</h3>

        <div className="flex flex-col gap-2">
          {/* Original */}
          <GlassCard className="!border-primary-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">👤</span>
              <span className="text-xs text-primary-300/60">原话</span>
            </div>
            <div className="text-white/90">{state.promptText}</div>
          </GlassCard>

          {/* Chain steps */}
          {state.chain.map((step, i) => (
            <div key={step.step}>
              <div className="flex justify-center text-primary-500/40 text-xs py-1">
                ↓ ↓ ↓
              </div>
              <GlassCard>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{step.emoji}</span>
                  <span className="text-xs text-primary-300/60">{step.personality}</span>
                  {i === state.chain.length - 1 && (
                    <span className="text-xs text-primary-400 ml-auto">最终</span>
                  )}
                </div>
                <div className="text-white/90">{step.text}</div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleCopy} className="flex-1">
          复制
        </Button>
        <Button onClick={handleReplay} className="flex-1">
          再来一局
        </Button>
      </div>

      {state.driftScore !== null && (
        <ShareCard
          promptText={state.promptText}
          chain={state.chain}
          driftScore={state.driftScore}
        />
      )}
    </div>
  );
}
