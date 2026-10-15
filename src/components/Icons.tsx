import React from 'react';

// Thin line icons drawn to match the invitation's fine typography (24×24, currentColor)
type IconProps = React.SVGProps<SVGSVGElement>;

const Line: React.FC<IconProps> = ({ children, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const CalendarIcon = (p: IconProps) => (
  <Line {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></Line>
);
export const ClockIcon = (p: IconProps) => (
  <Line {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Line>
);
export const PinIcon = (p: IconProps) => (
  <Line {...p}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></Line>
);
export const HeartIcon = ({ filled = true, ...p }: IconProps & { filled?: boolean }) => (
  <Line {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />
  </Line>
);
export const ArrowRightIcon = (p: IconProps) => <Line {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Line>;
export const ArrowLeftIcon = (p: IconProps) => <Line {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Line>;
export const ArrowUpRightIcon = (p: IconProps) => <Line {...p}><path d="M7 17 17 7M9 7h8v8" /></Line>;
export const ArrowDownIcon = (p: IconProps) => <Line {...p}><path d="M12 5v14M6 13l6 6 6-6" /></Line>;
export const CloseIcon = (p: IconProps) => <Line {...p}><path d="M6 6l12 12M18 6 6 18" /></Line>;
export const CheckIcon = (p: IconProps) => <Line {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Line>;
export const VolumeIcon = (p: IconProps) => (
  <Line {...p}><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></Line>
);
export const VolumeOffIcon = (p: IconProps) => (
  <Line {...p}><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" /><path d="m16 9.5 5 5m0-5-5 5" /></Line>
);
export const MosqueIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M12 2.5v1.5M12 4c-2.9 1.7-4.8 3.4-4.8 6h9.6c0-2.6-1.9-4.3-4.8-6z" />
    <path d="M6.5 10h11v10.5h-11zM10.4 20.5v-3.2a1.6 1.6 0 0 1 3.2 0v3.2" />
    <path d="M2.8 20.5V10.5l1-2.2 1 2.2v10M19.2 20.5V10.5l1-2.2 1 2.2v10M2 20.5h20" />
  </Line>
);
export const RingsIcon = (p: IconProps) => (
  <Line {...p}>
    <circle cx="9" cy="14.5" r="5.5" /><circle cx="15" cy="14.5" r="5.5" />
    <path d="m13.4 6.6 1.6-2 1.6 2-1.6 2.4z" />
  </Line>
);

export const PauseIcon = (p: IconProps) => <Line {...p}><path d="M9 6v12M15 6v12" /></Line>;
export const PlayIcon = (p: IconProps) => <Line {...p}><path d="M8 5.5v13l10.5-6.5z" /></Line>;
export const ExpandIcon = (p: IconProps) => <Line {...p}><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5" /></Line>;

export const CheersIcon =(p: IconProps) => (
  <Line {...p}>
    <path d="M5.2 4.5 9.8 3.3l1.3 5.2a2.6 2.6 0 0 1-1.9 3.1l-.4.1a2.6 2.6 0 0 1-3.1-1.9z" />
    <path d="M18.8 4.5l-4.6-1.2-1.3 5.2a2.6 2.6 0 0 0 1.9 3.1l.4.1a2.6 2.6 0 0 0 3.1-1.9z" />
    <path d="M8.3 11.8 9.9 18M6.9 18.7l5-1.3M15.7 11.8 14.1 18M17.1 18.7l-5-1.3" />
    <path d="M12 1.2v1.6M9.8 1.6l.5 1M14.2 1.6l-.5 1" />
  </Line>
);

/* ── Botanical line art ── */


interface SprigProps extends IconProps {
  /** mirrors the sprig horizontally */
  flip?: boolean;
}

// long willow/olive leaf, pointed at both ends, drawn along +x (length 40)
const LONG_LEAF = 'M0 0 C8 -11.5 26 -13.5 42 0 C26 13.5 8 11.5 0 0 Z';
const LEAF_VEIN = 'M3 0 C15 -1.2 27 -1.2 38 0';

// main stem: a soft S-curve from the bottom up to the tip (viewBox 120×200)
const STEM: [number, number][] = [[58, 198], [44, 140], [86, 84], [70, 8]];

const bezier = (t: number) => {
  const [p0, p1, p2, p3] = STEM;
  const u = 1 - t;
  const point = [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
  const tangent = [0, 1].map((k) => 3 * u * u * (p1[k] - p0[k]) + 6 * u * t * (p2[k] - p1[k]) + 3 * t * t * (p3[k] - p2[k]));
  return { x: point[0], y: point[1], angle: (Math.atan2(tangent[1], tangent[0]) * 180) / Math.PI };
};

// leaves alternate sides, angled toward the tip and shrinking as they climb
const BRANCH_LEAVES = [0.16, 0.26, 0.36, 0.46, 0.55, 0.64, 0.72, 0.8, 0.87, 0.93].map((t, i) => {
  const { x, y, angle } = bezier(t);
  const side = i % 2 === 0 ? -1 : 1;
  return { x, y, angle: angle + side * 48, scale: 1.2 - t * 0.55 };
});
const TIP = bezier(1);

/** A delicate olive branch in soft sage-gold: veined leaves on a curved stem, with a few buds */
export const Sprig: React.FC<SprigProps> = ({ flip, className, ...p }) => (
  <svg
    viewBox="0 0 120 200"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={`sprig${className ? ` ${className}` : ''}`}
    {...p}
  >
    <g transform={flip ? 'matrix(-1 0 0 1 120 0)' : undefined}>
      <path d={`M${STEM[0]} C${STEM[1]} ${STEM[2]} ${STEM[3]}`} strokeWidth={1.3} />
      {/* small side twig with buds */}
      <path d="M50 152 C38 146 30 138 24 126" strokeWidth={1} />
      <circle cx="23" cy="123" r="2.6" fill="currentColor" fillOpacity={0.35} strokeWidth={0.8} />
      <circle cx="31" cy="133" r="2" fill="currentColor" fillOpacity={0.35} strokeWidth={0.8} />
      {BRANCH_LEAVES.map(({ x, y, angle, scale }, i) => (
        <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${scale.toFixed(2)})`}>
          <path d={LONG_LEAF} fill="currentColor" fillOpacity={0.3} strokeWidth={1.2} />
          <path d={LEAF_VEIN} strokeWidth={0.7} strokeOpacity={0.75} />
        </g>
      ))}
      <g transform={`translate(${TIP.x.toFixed(1)} ${TIP.y.toFixed(1)}) rotate(${TIP.angle.toFixed(1)}) scale(0.6)`}>
        <path d={LONG_LEAF} fill="currentColor" fillOpacity={0.3} strokeWidth={1.2} />
        <path d={LEAF_VEIN} strokeWidth={0.7} strokeOpacity={0.75} />
      </g>
    </g>
  </svg>
);
