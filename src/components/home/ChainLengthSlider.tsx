import { useAppContext } from '../../hooks/useAppContext';

export default function ChainLengthSlider() {
  const { state, dispatch } = useAppContext();

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-primary-300">链条长度</span>
        <span className="text-sm font-medium text-white">{state.chainLength} 人</span>
      </div>
      <input
        type="range"
        min={5}
        max={10}
        value={state.chainLength}
        onChange={(e) => dispatch({ type: 'SET_CHAIN_LENGTH', payload: Number(e.target.value) })}
        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-gradient-to-r
          [&::-webkit-slider-thumb]:from-primary-600
          [&::-webkit-slider-thumb]:to-primary-400
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:shadow-primary-600/30"
      />
      <div className="flex justify-between text-xs text-white/20 mt-1">
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}
