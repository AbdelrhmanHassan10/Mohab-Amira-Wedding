import React from 'react';
import { m } from 'framer-motion';
import Photo from './Photo';
import Wave from './Wave';
import { CalendarIcon, HeartIcon } from './Icons';
import { scrollToElement } from './SmoothScroll';
import { COUPLE, CELEBRATION } from '../content/wedding';
import { EASE_SOFT } from '../motion';
import './Hero.css';

interface HeroProps {
  /** called from the CTA click, a user gesture, so browsers allow the music to start */
  onBegin?: () => void;
}

const enter = (delay: number, y = 18) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay, ease: EASE_SOFT },
});

const Hero: React.FC<HeroProps> = ({ onBegin }) => (
  <section className="hero" aria-labelledby="hero-title">
    <div className="hero__media">
      <Photo
        name="hero-couple"
        alt="Mohab and Amira smiling together on a flower-framed, lantern-lit balcony overlooking the Nile at sunset"
        sizes="100vw"
        priority
        className="hero__photo"
      />
    </div>
    <div className="hero__veil" aria-hidden="true" />

    <div className="hero__inner container">
      <div className="hero__copy">
        <m.p className="hero__eyebrow" {...enter(0.15)}>
          Together with their families
        </m.p>

        <m.h1 id="hero-title" className="hero__names" {...enter(0.3, 26)}>
          <span className="hero__name">{COUPLE.first}</span>
          <span className="hero__and">and</span>
          <span className="hero__name">{COUPLE.second}</span>
        </m.h1>

        <m.p className="hero__lede" {...enter(0.55)}>
          we invite you to celebrate the beginning of our forever
        </m.p>

        <m.div className="ornament hero__ornament" aria-hidden="true" {...enter(0.65, 0)}>
          <HeartIcon />
        </m.div>

        <m.p className="hero__date" {...enter(0.75)}>
          <CalendarIcon className="hero__date-icon" />
          <span>
            <time dateTime={CELEBRATION.dateTime}>{CELEBRATION.date}</time>
            <small>For the Wedding Celebration</small>
          </span>
        </m.p>

        <m.div {...enter(0.9)}>
          <button
            type="button"
            className="btn btn--forest hero__cta"
            onClick={() => {
              onBegin?.();
              scrollToElement(document.getElementById('details'));
            }}
          >
            Our Special Day
            <HeartIcon />
          </button>
        </m.div>
      </div>

      <m.p
        className="hero__script"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.1 }}
      >
        Our Forever
        <br />
        <span>Begins…</span>
        <HeartIcon filled={false} />
      </m.p>
    </div>

    <Wave position="inset-bottom" shape="hero" fill="var(--ivory)" />
  </section>
);

export default Hero;
