import React, { useRef, useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import { reveal } from '../motion';
import './WeddingGallery.css';

const GALLERY_IMAGES = [
  { src: '/couple-sunset.png', alt: 'Romantic sunset moment' },
  { src: '/couple-lantern.png', alt: 'Together by lanternlight' },
  { src: '/grand.webp', alt: 'Wedding venue decorations' },
  { src: '/mosque.png', alt: 'Beautiful architecture' },
  { src: '/couple-art.png', alt: 'A beautiful beginning' },
];

const WeddingGallery: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const goNext = useCallback(() => {
    setLightboxIdx((i) => (i !== null ? (i + 1) % GALLERY_IMAGES.length : null));
  }, []);
  const goPrev = useCallback(() => {
    setLightboxIdx((i) => (i !== null ? (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null));
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [lightboxIdx, goNext, goPrev]);

  return (
    <section className="gallery" id="gallery">
      <div className="gallery-inner">
        <m.div className="gallery-header" {...reveal()}>
          <span className="section-tag">OUR GALLERY</span>
          <h2 className="gallery-title">Moments We'll Always Cherish</h2>
          <div className="gold-line" style={{ margin: '1rem auto 0' }} />
        </m.div>

        <m.div className="gallery-carousel-wrap" {...reveal(0.1)}>
          <button className="gallery-arrow gallery-arrow--left" onClick={() => scroll('left')} aria-label="Previous">
            <FaArrowLeft size={14} />
          </button>

          <div className="gallery-scroll" ref={scrollRef}>
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={i}
                className="gallery-item"
                type="button"
                onClick={() => openLightbox(i)}
                aria-label={`View ${img.alt}`}
              >
                <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
                <div className="gallery-item-overlay">
                  <span>View</span>
                </div>
              </button>
            ))}
          </div>

          <button className="gallery-arrow gallery-arrow--right" onClick={() => scroll('right')} aria-label="Next">
            <FaArrowRight size={14} />
          </button>
        </m.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <m.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
            role="dialog"
            aria-label="Image lightbox"
          >
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
              <FaTimes size={20} />
            </button>

            <button className="lightbox-nav lightbox-nav--prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous image">
              <FaArrowLeft size={18} />
            </button>

            <m.img
              key={lightboxIdx}
              className="lightbox-img"
              src={GALLERY_IMAGES[lightboxIdx].src}
              alt={GALLERY_IMAGES[lightboxIdx].alt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />

            <button className="lightbox-nav lightbox-nav--next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next image">
              <FaArrowRight size={18} />
            </button>

            <p className="lightbox-counter">
              {lightboxIdx + 1} / {GALLERY_IMAGES.length}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WeddingGallery;
