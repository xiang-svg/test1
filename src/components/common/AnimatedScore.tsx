import { useState, useEffect, useRef } from 'react';

interface AnimatedScoreProps {
  target: number;
}

export default function AnimatedScore({ target }: AnimatedScoreProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startRef.current + (target - startRef.current) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  const getEmoji = () => {
    if (target <= 30) return '😱';
    if (target <= 60) return '🫠';
    if (target <= 80) return '😎';
    return '💯';
  };

  const getLabel = () => {
    if (target <= 30) return '意思完全跑偏了！';
    if (target <= 60) return '意思变了不少...';
    if (target <= 80) return '意思还算接近';
    return '传话高手！意思几乎没变';
  };

  return (
    <div className="text-center py-6">
      <div className="text-sm text-primary-300 mb-2">漂移分数</div>
      <div className="flex items-center justify-center gap-3">
        <span className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-purple-300 bg-clip-text text-transparent">
          {display}%
        </span>
        <span className="text-4xl">{getEmoji()}</span>
      </div>
      <div className="text-primary-300/60 text-sm mt-2">{getLabel()}</div>
    </div>
  );
}
