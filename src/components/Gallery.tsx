import React, { useState } from 'react';
import { m } from 'framer-motion';
import Photo from './Photo';
import Lightbox from './Lightbox';
import SectionHeading from './SectionHeading';
import { ExpandIcon, PauseIcon, PlayIcon } from './Icons';
import { GALLERY } from '../content/wedding';
import { reveal } from '../motion';
import './Gallery.css';

// the row repeats its photos so the loop never shows an empty edge;
// the track slides by exactly one set, then starts over seamlessly
const COPIES = 3;
const SHAPES = ['portrait', 'landscape', 'square'] as const;

const Gallery: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="container">
        <SectionHeading id="gallery-title" eyebrow="Our Gallery" title="Moments We’ll Always Cherish" />
      </div>

      <m.div
        className={`marquee${paused || openIndex !== null ? ' is-paused' : ''}`}
        aria-label="Wedding photos — select one to enlarge"
        role="region"
        {...reveal(0.1)}
      >
        <div className="marquee__row">
          <ul className="marquee__track">
            {Array.from({ length: COPIES }, (_, copy) =>
              GALLERY.map((photo, i) => {
                // only the first copy is announced and tabbable; the rest are visual repeats
                const isPrimary = copy === 0;
                return (
                  <li
                    key={`${copy}-${photo.name}`}
                    className={`marquee__item marquee__item--${SHAPES[i % SHAPES.length]}`}
                    aria-hidden={isPrimary ? undefined : true}
                  >
                    <button
                      type="button"
                      className="marquee__open"
                      tabIndex={isPrimary ? 0 : -1}
                      onClick={() => setOpenIndex(i)}
                      aria-label={`Enlarge photo ${i + 1} of ${GALLERY.length}: ${photo.alt}`}
                    >
                      <Photo
                        name={photo.name}
                        alt=""
                        position={photo.position}
                        sizes="(max-width: 600px) 60vw, 360px"
                      />
                      <span className="marquee__zoom" aria-hidden="true"><ExpandIcon /></span>
                    </button>
                  </li>
                );
              }),
            )}
          </ul>
        </div>
      </m.div>

      <div className="gallery__controls">
        {/* icon-only control framed like the section ornaments */}
        <button
          type="button"
          className={`gallery__toggle${paused ? ' is-paused' : ''}`}
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
          title={paused ? 'Play' : 'Pause'}
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
      </div>

      <Lightbox
        photos={GALLERY}
        index={openIndex}
        onChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
};

export default Gallery;
