import { useEffect } from 'react';
import { useAppContext, selectRandomPersonalities } from '../../hooks/useAppContext';
import PromptInput from './PromptInput';
import PersonalityPreview from './PersonalityPreview';
import ChainLengthSlider from './ChainLengthSlider';
import Button from '../common/Button';

export default function HomePage() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    if (state.selectedPersonalities.length === 0) {
      dispatch({ type: 'SET_PERSONALITIES', payload: selectRandomPersonalities(state.chainLength) });
    }
  }, []);

  const canStart = state.promptText.trim().length > 0;

  const handleStart = () => {
    if (state.selectedPersonalities.length !== state.chainLength) {
      dispatch({ type: 'SET_PERSONALITIES', payload: selectRandomPersonalities(state.chainLength) });
    }
    setTimeout(() => dispatch({ type: 'START_GAME' }), 0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-300 bg-clip-text text-transparent">
          DriftScript
        </h1>
        <p className="text-primary-300/60 text-sm mt-1">AI 电话传话游戏</p>
      </div>

      <PromptInput />
      <PersonalityPreview />
      <ChainLengthSlider />

      <Button onClick={handleStart} disabled={!canStart} className="w-full text-lg">
        开始传话
      </Button>

      <button
        className="text-center text-sm text-white/30 hover:text-white/50 transition-colors"
        onClick={() => dispatch({ type: 'GO_SETTINGS' })}
      >
        设置
      </button>
    </div>
  );
}
