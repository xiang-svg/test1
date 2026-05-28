interface EmojiIconProps {
  emoji: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function EmojiIcon({ emoji, size = 'md' }: EmojiIconProps) {
  const sizes = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-6xl' };
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-white/10 ${sizes[size]}`}>
      <span role="img" aria-label="personality">{emoji}</span>
    </div>
  );
}
