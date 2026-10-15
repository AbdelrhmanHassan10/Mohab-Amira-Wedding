import React from 'react';
import { m } from 'framer-motion';
import './SectionDivider.css';

/* Ornamental break between two sections: gold hairlines fading out to the sides,
   gold scrolls and a purple heart in the middle */
const SectionDivider: React.FC = () => (
  <div className="section-divider" role="separator" aria-hidden="true">
    <m.span
      className="section-divider-line is-left"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    />

    <m.svg
      className="section-divider-ornament"
      viewBox="0 0 140 28"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
    >
      {/* scrolls curling in towards the heart */}
      <path
        className="ornament-gold-stroke"
        d="M4 14 C 20 14, 26 5, 36 8 C 44 10.5, 42 19, 35 18 C 30 17.3, 31 11.5, 36 12 M 44 14 H 52"
      />
      <path
        className="ornament-gold-stroke"
        d="M136 14 C 120 14, 114 5, 104 8 C 96 10.5, 98 19, 105 18 C 110 17.3, 109 11.5, 104 12 M 96 14 H 88"
      />
      {/* small diamonds on either side */}
      <path className="ornament-gold-fill" d="M56 14 L59 11 L62 14 L59 17 Z" />
      <path className="ornament-gold-fill" d="M78 14 L81 11 L84 14 L81 17 Z" />
      {/* heart */}
      <path
        className="ornament-heart"
        d="M70 21.5 C 64 17, 62.5 14.2, 62.5 11.8 C 62.5 9.6, 64.2 8, 66.2 8 C 67.8 8, 69.2 8.9, 70 10.3 C 70.8 8.9, 72.2 8, 73.8 8 C 75.8 8, 77.5 9.6, 77.5 11.8 C 77.5 14.2, 76 17, 70 21.5 Z"
      />
    </m.svg>

    <m.span
      className="section-divider-line is-right"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    />
  </div>
);

export default SectionDivider;
