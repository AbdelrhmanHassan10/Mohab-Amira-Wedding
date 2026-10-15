import React from 'react';
import { m } from 'framer-motion';
import { HeartIcon } from './Icons';
import { reveal } from '../motion';

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  className?: string;
}

/** Centered eyebrow + serif title + gold ornament, as used across the invitation */
const SectionHeading: React.FC<SectionHeadingProps> = ({ id, eyebrow, title, className }) => (
  <m.header className={`section-heading${className ? ` ${className}` : ''}`} {...reveal()}>
    <span className="eyebrow">{eyebrow}</span>
    <h2 id={id} className="section-heading__title">{title}</h2>
    <div className="ornament" aria-hidden="true"><HeartIcon /></div>
  </m.header>
);

export default SectionHeading;
