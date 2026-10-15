import React from 'react';
import { m } from 'framer-motion';
import { reveal } from '../motion';
import './OurStory.css';

const OurStory: React.FC = () => (
  <section id="our-story" className="story">
    {/* Top curve transition */}
    <div className="story-curve-top" aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z" fill="var(--forest)" />
      </svg>
    </div>

    <div className="story-bg">
      <div className="story-inner">
        {/* Left text column */}
        <m.div className="story-text" {...reveal()}>
          <span className="section-tag section-tag--light">THE STORY</span>
          <h2 className="story-title">
            Two Hearts,
            <br />
            <em>One Beautiful Journey</em>
          </h2>
          <p className="story-body">
            It all started with a simple conversation, turned into endless laughter,
            and grew into a beautiful journey that brought us here.
          </p>
          <button
            className="btn-outline btn-outline--light story-btn"
            type="button"
            onClick={() => {
              const el = document.getElementById('rsvp');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>READ OUR STORY</span>
            <span>→</span>
          </button>
        </m.div>

        {/* Right photo collage */}
        <m.div className="story-collage" {...reveal(0.15)}>
          <div className="collage-photo collage-photo--1">
            <img src="/couple-sunset.png" alt="Couple at sunset" loading="lazy" decoding="async" />
          </div>
          <div className="collage-photo collage-photo--2">
            <img src="/m.webp" alt="Romantic moment" loading="lazy" decoding="async" />
          </div>
          <div className="collage-photo collage-photo--3">
            <img src="/couple-lantern.png" alt="Together by lanternlight" loading="lazy" decoding="async" />
          </div>
          <div className="collage-photo collage-photo--4">
            <img src="/s.webp" alt="A beautiful beginning" loading="lazy" decoding="async" />
          </div>
        </m.div>
      </div>

      {/* Botanical leaf decoration */}
      <div className="story-leaf story-leaf--left" aria-hidden="true">
        <svg viewBox="0 0 80 160" fill="none">
          <path d="M40 160 C35 130 10 110 5 80 C0 50 20 30 35 40 C25 25 30 5 45 2 C50 1 52 8 48 18 C58 5 70 12 67 30 C60 20 50 28 45 45 C55 38 65 50 58 70 C50 50 40 55 40 80 Z" 
                fill="none" stroke="rgba(198,166,106,0.2)" strokeWidth="0.5"/>
        </svg>
      </div>
      <div className="story-leaf story-leaf--right" aria-hidden="true">
        <svg viewBox="0 0 80 160" fill="none">
          <path d="M40 160 C45 130 70 110 75 80 C80 50 60 30 45 40 C55 25 50 5 35 2 C30 1 28 8 32 18 C22 5 10 12 13 30 C20 20 30 28 35 45 C25 38 15 50 22 70 C30 50 40 55 40 80 Z" 
                fill="none" stroke="rgba(198,166,106,0.2)" strokeWidth="0.5"/>
        </svg>
      </div>
    </div>

    {/* Bottom curve transition */}
    <div className="story-curve-bottom" aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,80 C360,0 1080,0 1440,80 L1440,0 L0,0 Z" fill="var(--forest)" />
      </svg>
    </div>
  </section>
);

export default OurStory;
