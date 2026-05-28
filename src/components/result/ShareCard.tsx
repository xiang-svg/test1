import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';

interface ShareCardProps {
  promptText: string;
  chain: { personality: string; emoji: string; text: string }[];
  driftScore: number;
}

export default function ShareCard({ promptText, chain, driftScore }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: '#0f0520',
      useCORS: true,
    });
    const link = document.createElement('a');
    link.download = `driftscript-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const getEmoji = () => {
    if (driftScore <= 30) return '😱';
    if (driftScore <= 60) return '🫠';
    if (driftScore <= 80) return '😎';
    return '💯';
  };

  return (
    <>
      <button
        onClick={handleGenerate}
        className="text-primary-400 hover:text-primary-300 text-sm active:scale-95 transition-all"
      >
        保存卡片
      </button>

      {/* Hidden share card for html2canvas */}
      <div
        ref={cardRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: 375,
          padding: 24,
          background: 'linear-gradient(180deg, #0f0520 0%, #1a0a2e 100%)',
          color: '#f5f3ff',
          fontFamily: '-apple-system, PingFang SC, Microsoft YaHei, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#A855F7' }}>DriftScript</div>
          <div style={{ fontSize: 12, color: 'rgba(168,85,247,0.6)' }}>AI 电话传话游戏</div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ fontSize: 12, color: 'rgba(168,85,247,0.6)', marginBottom: 8 }}>原话</div>
          <div style={{ fontSize: 16, color: '#fff' }}>{promptText}</div>
        </div>

        {chain.length > 0 && (
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontSize: 12, color: 'rgba(168,85,247,0.6)', marginBottom: 8 }}>
              {chain[chain.length - 1].emoji} {chain[chain.length - 1].personality}
            </div>
            <div style={{ fontSize: 16, color: '#fff' }}>{chain[chain.length - 1].text}</div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ fontSize: 32, fontWeight: 'bold', color: '#A855F7' }}>{driftScore}%</span>
          <span style={{ fontSize: 24, marginLeft: 8 }}>{getEmoji()}</span>
        </div>
      </div>
    </>
  );
}
