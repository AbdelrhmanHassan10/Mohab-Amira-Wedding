import React from 'react';

// Organic section edges. Each shape fills the area *below* the curve (viewBox 1440×100);
// `position="bottom"` flips it so it hangs below the section instead.
const SHAPES = {
  gentle: 'M0 100 V62 C220 22 430 8 700 40 C980 74 1210 84 1440 34 V100 Z',
  swell: 'M0 100 V30 C260 78 520 92 800 58 C1060 26 1260 18 1440 54 V100 Z',
  hero: 'M0 100 V48 C180 92 420 98 690 64 C960 30 1190 22 1440 66 V100 Z',
} as const;

interface WaveProps {
  shape?: keyof typeof SHAPES;
  position: 'top' | 'bottom' | 'inset-bottom';
  /** any CSS colour; matches the section the wave belongs to */
  fill: string;
  mirror?: boolean;
  className?: string;
}

const Wave: React.FC<WaveProps> = ({ shape = 'gentle', position, fill, mirror, className }) => {
  const flips = [mirror ? 'scaleX(-1)' : '', position === 'bottom' ? 'scaleY(-1)' : ''].join(' ').trim();
  return (
    <svg
      className={`wave wave--${position}${className ? ` ${className}` : ''}`}
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={flips ? { transform: flips } : undefined}
    >
      <path d={SHAPES[shape]} fill={fill} />
    </svg>
  );
};

export default Wave;
