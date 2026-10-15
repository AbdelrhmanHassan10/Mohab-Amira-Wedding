import React from 'react';
import { HeartIcon, Sprig } from './Icons';
import { COUPLE, CONTRACT } from '../content/wedding';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer on-dark">
    <Sprig className="footer__sprig footer__sprig--left" />
    <Sprig className="footer__sprig footer__sprig--right" flip />

    <div className="footer__inner container">
      <span className="footer__divider" aria-hidden="true" />
      <p className="footer__names">
        <span>{COUPLE.first}</span>
        <HeartIcon filled={false} aria-label="and" role="img" aria-hidden={undefined} />
        <span>{COUPLE.second}</span>
      </p>
      <p className="footer__thanks">Thank you for being part of our story</p>
      <p className="footer__date">
        <time dateTime={CONTRACT.dateTime}>24 · 10 · 2026</time>
      </p>
    </div>
  </footer>
);

export default Footer;
