import React, { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import Photo from './Photo';
import Wave from './Wave';
import { ArrowUpRightIcon, Sprig } from './Icons';
import { STORY } from '../content/wedding';
import { EASE_SOFT, reveal } from '../motion';
import './OurStory.css';

const OurStory: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="story on-dark" id="story" aria-labelledby="story-title">
      <Wave position="top" shape="gentle" fill="var(--forest)" />

      {/* botanical line art framing the band, as in the reference */}
      <Sprig className="story__sprig story__sprig--top-left" />
      <Sprig className="story__sprig story__sprig--bottom-left" flip />
      <Sprig className="story__sprig story__sprig--collage-left" />
      <Sprig className="story__sprig story__sprig--collage-top" flip />
      <Sprig className="story__sprig story__sprig--collage-right" flip />

      <div className="story__inner container">
        <m.div className="story__text" {...reveal()}>
          <span className="eyebrow">The Story</span>
          <h2 id="story-title" className="story__title">
            Two Hearts,
            <br />
            One Beautiful Journey
          </h2>
          <p className="story__lead">{STORY.lead}</p>

          <div id="story-more">
            <AnimatePresence initial={false}>
              {open && (
                <m.div
                  className="story__more"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE_SOFT }}
                >
                  {STORY.more.map((p) => <p key={p}>{p}</p>)}
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="btn btn--gold story__btn"
            aria-expanded={open}
            aria-controls="story-more"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close Our Story' : 'Read Our Story'}
            <ArrowUpRightIcon className={open ? 'is-open' : undefined} />
          </button>
        </m.div>

        <m.figure className="story__portrait" {...reveal(0.15)}>
          <span className="story__print-back" aria-hidden="true" />
          <span className="story__tape" aria-hidden="true" />
          <div className="story__portrait-frame">
            <Photo
              name={STORY.photo.name}
              alt={STORY.photo.alt}
              position={STORY.photo.position}
              sizes="(max-width: 960px) 80vw, 420px"
            />
            <figcaption className="story__caption">Where it all began…</figcaption>
          </div>
        </m.figure>
      </div>

      <Wave position="bottom" shape="swell" fill="var(--forest)" mirror />
    </section>
  );
};

export default OurStory;
