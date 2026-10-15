import React from 'react';
import { m } from 'framer-motion';
import { FaCalendarAlt, FaHeart } from 'react-icons/fa';
import { scrollToElement } from './SmoothScroll';
import './HeroCinematic.css';

interface HeroCinematicProps {
  onPlayMusic?: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

const HeroCinematic: React.FC<HeroCinematicProps> = ({ onPlayMusic }) => (
  <section className="hero" id="hero">
    {/* Background image layer */}
    <div className="hero-bg">
      <img
        src="/hero-bg.png"
        alt=""
        className="hero-bg-img"
        loading="eager"
        decoding="async"
      />
      <div className="hero-overlay" />
    </div>

    {/* Floral decorations */}
    <div className="hero-floral hero-floral--left" aria-hidden="true">
      <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 200 C55 170 20 150 10 120 C0 90 25 70 45 80 C30 60 35 30 55 20 C65 15 70 25 65 40 C80 20 100 30 95 55 C110 40 120 60 105 80 C95 65 80 75 75 95 C85 85 95 100 85 120 C75 95 60 100 60 130 Z" 
              fill="rgba(255,255,255,0.08)" stroke="rgba(198,166,106,0.15)" strokeWidth="0.5"/>
      </svg>
    </div>
    <div className="hero-floral hero-floral--right" aria-hidden="true">
      <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 200 C65 170 100 150 110 120 C120 90 95 70 75 80 C90 60 85 30 65 20 C55 15 50 25 55 40 C40 20 20 30 25 55 C10 40 0 60 15 80 C25 65 40 75 45 95 C35 85 25 100 35 120 C45 95 60 100 60 130 Z" 
              fill="rgba(255,255,255,0.08)" stroke="rgba(198,166,106,0.15)" strokeWidth="0.5"/>
      </svg>
    </div>

    {/* Content */}
    <div className="hero-content">
      <div className="hero-left">
        <m.p
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease }}
        >
          Together with their families
          <br />
          <span>we invite you to</span>
        </m.p>

        <m.div
          className="hero-names"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease }}
        >
          <h1 className="hero-name hero-name--groom">MAHAB</h1>
          <span className="hero-and">and</span>
          <h1 className="hero-name hero-name--bride">AMIRA</h1>
        </m.div>

        <m.p
          className="hero-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Two hearts, one journey
          <br />
          A lifetime of love
        </m.p>

        <m.div
          className="hero-date-row"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease }}
        >
          <FaCalendarAlt className="hero-date-icon" />
          <div>
            <p className="hero-date-main">16 OCTOBER 2026</p>
            <p className="hero-date-sub">For the Marriage Contract</p>
          </div>
        </m.div>

        <m.button
          className="btn-primary hero-cta"
          type="button"
          onClick={() => {
            onPlayMusic?.();
            scrollToElement(document.getElementById('events'));
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>OUR SPECIAL DAY</span>
          <FaHeart size={10} />
        </m.button>
      </div>

      <m.div
        className="hero-right"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.4, delay: 0.8, ease }}
      >
        <p className="hero-script">Our Forever<br />Begins...</p>
      </m.div>
    </div>

    {/* Bottom curve into next section */}
    <div className="hero-curve" aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,80 C360,0 1080,0 1440,80 L1440,80 L0,80 Z" fill="var(--ivory)" />
      </svg>
    </div>
  </section>
);

export default HeroCinematic;
