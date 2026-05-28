import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../hooks/useAppContext';
import { useGameEngine } from '../../hooks/useGameEngine';
import ProgressBar from '../common/ProgressBar';
import EmojiIcon from '../common/EmojiIcon';
import Button from '../common/Button';
import type { Personality } from '../../types';

function StepCard({
  personality,
  text,
  isStreaming,
}: {
  personality: Personality;
  text: string;
  isStreaming?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <EmojiIcon emoji={personality.emoji} size="sm" />
        <div>
          <div className="font-medium text-white">{personality.name}</div>
          <div className="text-xs text-primary-300/60">正在传话...</div>
        </div>
      </div>
      <div className="text-lg text-white/90 leading-relaxed min-h-[3rem]">
        {text}
        {isStreaming && <span className="animate-pulse text-primary-400">|</span>}
      </div>
    </motion.div>
  );
}

function CompletedStep({ step }: { step: { personality: string; emoji: string; text: string } }) {
  return (
    <div className="flex gap-3 items-start opacity-50">
      <div className="text-xl flex-shrink-0">{step.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-primary-300/60">{step.personality}</div>
        <div className="text-sm text-white/60 truncate">{step.text}</div>
      </div>
    </div>
  );
}

export default function GamePage() {
  const { state } = useAppContext();
  const { runChain, skipToEnd, reset } = useGameEngine();
  const startedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      runChain();
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.streamingText, state.currentStep]);

  const currentPersonality = state.selectedPersonalities[state.currentStep];
  const isComplete = state.chain.length === state.selectedPersonalities.length;

  if (state.error) {
    return (
      <div className="flex flex-col items-center gap-4 pt-10">
        <div className="text-4xl">😵</div>
        <div className="text-red-400 text-center">{state.error}</div>
        <Button onClick={reset}>返回首页</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ProgressBar
        current={Math.min(state.chain.length + 1, state.selectedPersonalities.length)}
        total={state.selectedPersonalities.length}
      />

      <div className="flex flex-col gap-3 mt-2">
        {/* Completed steps */}
        {state.chain.map((step) => (
          <CompletedStep key={step.step} step={step} />
        ))}

        {/* Current streaming step */}
        <AnimatePresence mode="wait">
          {state.isStreaming && currentPersonality && (
            <StepCard
              key={state.currentStep}
              personality={currentPersonality}
              text={state.streamingText}
              isStreaming
            />
          )}
        </AnimatePresence>

        {/* Scoring indicator */}
        {isComplete && state.isScoring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-5 text-center"
          >
            <div className="text-2xl mb-2 animate-bounce">🎯</div>
            <div className="text-primary-300">正在计算漂移分数...</div>
          </motion.div>
        )}
      </div>

      <div ref={scrollRef} />

      <div className="flex gap-3 mt-2">
        {state.isStreaming && (
          <Button variant="secondary" onClick={skipToEnd} className="flex-1">
            跳过
          </Button>
        )}
      </div>
    </div>
  );
}
