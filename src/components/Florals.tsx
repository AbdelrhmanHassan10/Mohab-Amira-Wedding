import React from 'react';

// Fine line-art florals for the RSVP card: spiral roses and five-petal blossoms in
// champagne gold, sage leaves and buds on curved stems. Colours come from CSS:
// `.floral__flower` and `.floral__leaf` set `color` (everything uses currentColor).

type Pt = [number, number];
type Stem = [Pt, Pt, Pt, Pt];

const LEAF = 'M0 0 C8 -11 26 -13 42 0 C26 13 8 11 0 0 Z';
const VEIN = 'M3 0 C15 -1.2 27 -1.2 38 0';

// rose petal: a rounded lobe pointing up from the centre (length ~22)
const ROSE_PETAL = 'M0 0 C-10 -3 -14 -14 -7 -20 C-3 -23.5 3 -23.5 7 -20 C14 -14 10 -3 0 0 Z';
const ROSE_HEART = 'M0 -5.5 C4.5 -5.5 6 -0.5 3 3 C0 6 -5 3.5 -4 -0.5 C-3.2 -3.5 0.5 -3.5 1.2 -1 C1.8 1 -0.4 2 -1.4 0.6';

const PETAL = 'M0 0 C-6 -6 -6.5 -15 0 -18 C6.5 -15 6 -6 0 0 Z';
const BUD = 'M0 0 C-4.5 -5 -3.5 -13 0 -16 C3.5 -13 4.5 -5 0 0 Z';

const cubic = ([p0, p1, p2, p3]: Stem, t: number) => {
  const u = 1 - t;
  const at = (k: 0 | 1) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k];
  const d = (k: 0 | 1) => 3 * u * u * (p1[k] - p0[k]) + 6 * u * t * (p2[k] - p1[k]) + 3 * t * t * (p3[k] - p2[k]);
  return { x: at(0), y: at(1), angle: (Math.atan2(d(1), d(0)) * 180) / Math.PI };
};

// ── a corner spray: stems fan out from behind a large rose at the bottom-left of a 260×260 box ──
const STEMS: Stem[] = [
  [[30, 228], [60, 186], [100, 158], [150, 130]],
  [[30, 228], [40, 176], [44, 120], [36, 46]],
  [[30, 228], [86, 222], [154, 214], [234, 190]],
];

// stem, position along it, side (-1/1), size
const LEAVES: [number, number, number, number][] = [
  [0, 0.3, -1, 0.8], [0, 0.5, 1, 0.7], [0, 0.7, -1, 0.6],
  [1, 0.24, 1, 0.8], [1, 0.4, -1, 0.75], [1, 0.56, 1, 0.65], [1, 0.72, -1, 0.5],
  [2, 0.24, -1, 0.8], [2, 0.42, 1, 0.75], [2, 0.6, -1, 0.65], [2, 0.76, 1, 0.5],
];

// x, y, scale, rotation
const ROSES: [number, number, number, number][] = [
  [96, 168, 1.05, -25],
  [150, 208, 0.85, 30],
  [44, 138, 0.8, 10],
  [32, 226, 1.75, 15], // centrepiece covering where the stems meet
];
const BLOSSOMS: [number, number, number, number][] = [
  [152, 128, 0.9, 0], [34, 50, 0.9, 20], [234, 196, 0.85, 10],
  [58, 116, 0.65, 30], [190, 180, 0.6, 0], [92, 118, 0.5, 15],
];
const BUDS: [number, number, number, number][] = [
  [168, 114, 0.8, 50], [26, 30, 0.85, -15], [250, 186, 0.8, 75], [96, 210, 0.7, 160],
];

const Rose: React.FC<{ x: number; y: number; s: number; r: number }> = ({ x, y, s, r }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} className="floral__flower" strokeWidth={1.1 / s}>
    {/* solid petals hide what is behind them, so the layers read clearly */}
    {[0, 72, 144, 216, 288].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <path d={ROSE_PETAL} className="floral__petal" />
        <path d={ROSE_PETAL} fill="currentColor" fillOpacity={0.12} />
      </g>
    ))}
    {[36, 156, 276].map((a) => (
      <g key={a} transform={`rotate(${a}) scale(0.6)`}>
        <path d={ROSE_PETAL} className="floral__petal" strokeWidth={1.1 / s / 0.6} />
        <path d={ROSE_PETAL} fill="currentColor" fillOpacity={0.2} strokeWidth={1.1 / s / 0.6} />
      </g>
    ))}
    <circle r={6.5} className="floral__petal" />
    <path d={ROSE_HEART} />
  </g>
);

export const Blossom: React.FC<{ x: number; y: number; s: number; r: number }> = ({ x, y, s, r }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} className="floral__flower">
    {[0, 72, 144, 216, 288].map((a) => (
      <path key={a} d={PETAL} transform={`rotate(${a})`} fill="currentColor" fillOpacity={0.16} strokeWidth={1.1 / s} />
    ))}
    <circle r={2.6} fill="currentColor" fillOpacity={0.9} stroke="none" />
    {[36, 108, 180, 252, 324].map((a) => (
      <circle key={a} r={0.9} cx={0} cy={-5.5} transform={`rotate(${a})`} fill="currentColor" stroke="none" />
    ))}
  </g>
);

/** Rose-and-blossom corner spray; rotate/flip it with CSS to dress any corner */
export const FloralCorner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`floral${className ? ` ${className}` : ''}`}
    viewBox="0 0 260 260"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <g className="floral__leaf">
      {STEMS.map((s, i) => (
        <path key={i} d={`M${s[0]} C${s[1]} ${s[2]} ${s[3]}`} strokeWidth={1.2} />
      ))}
      {LEAVES.map(([stem, t, side, scale], i) => {
        const { x, y, angle } = cubic(STEMS[stem], t);
        return (
          <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(angle + side * 52).toFixed(1)}) scale(${scale})`}>
            <path d={LEAF} fill="currentColor" fillOpacity={0.2} strokeWidth={1.1 / scale} />
            <path d={VEIN} strokeWidth={0.7 / scale} strokeOpacity={0.8} />
          </g>
        );
      })}
      {BUDS.map(([x, y, s, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d={BUD} className="floral__bud" fill="currentColor" fillOpacity={0.3} strokeWidth={1 / s} />
          <path d="M0 0 L-4 -6 M0 0 L4 -6" strokeWidth={0.8 / s} />
        </g>
      ))}
    </g>
    {ROSES.map(([x, y, s, r], i) => <Rose key={i} x={x} y={y} s={s} r={r} />)}
    {BLOSSOMS.map(([x, y, s, r], i) => <Blossom key={i} x={x} y={y} s={s} r={r} />)}
  </svg>
);

/** Single blossom emblem with two small leaves, used above the RSVP heading */
export const FloralEmblem: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`floral${className ? ` ${className}` : ''}`}
    viewBox="-40 -30 80 50"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <g className="floral__leaf">
      <g transform="translate(-6 4) rotate(160) scale(0.7)">
        <path d={LEAF} fill="currentColor" fillOpacity={0.2} strokeWidth={1.4} />
        <path d={VEIN} strokeWidth={0.9} />
      </g>
      <g transform="translate(6 4) rotate(20) scale(0.7)">
        <path d={LEAF} fill="currentColor" fillOpacity={0.2} strokeWidth={1.4} />
        <path d={VEIN} strokeWidth={0.9} />
      </g>
    </g>
    <Blossom x={0} y={-2} s={1.05} r={0} />
  </svg>
);
