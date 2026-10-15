import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import Photo from './Photo';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from './Icons';
import { lockScroll, unlockScroll } from './SmoothScroll';
import type { PhotoRef } from '../content/wedding';
import './Lightbox.css';

interface LightboxProps {
  photos: PhotoRef[];
  /** open photo, or null when closed */
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}

/** Accessible photo viewer: focus is kept inside, Esc closes, ←/→ and swipes navigate */
const Lightbox: React.FC<LightboxProps> = ({ photos, index, onChange, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  const open = index !== null;
  const count = photos.length;

  const go = (step: number) => {
    if (index === null) return;
    onChange((index + step + count) % count);
  };

  // on open: lock page scroll, move focus in; on close: give focus back to the photo that opened it
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    lockScroll();
    closeRef.current?.focus();
    return () => {
      unlockScroll();
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const current = index !== null ? photos[index] : null;

  return createPortal(
    <AnimatePresence>
      {current && (
        <m.div
          ref={dialogRef}
          className="lightbox on-dark"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onKeyDown={onKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="lightbox__backdrop" onClick={onClose} aria-hidden="true" />

          <button ref={closeRef} type="button" className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Close photo viewer">
            <CloseIcon />
          </button>

          <figure
            className="lightbox__figure"
            onPointerDown={(e) => { swipeStart.current = e.clientX; }}
            onPointerUp={(e) => {
              if (swipeStart.current === null) return;
              const dx = e.clientX - swipeStart.current;
              swipeStart.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={current.name}
                className="lightbox__frame"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <Photo name={current.name} alt={current.alt} sizes="90vw" largest />
              </m.div>
            </AnimatePresence>
            <figcaption className="lightbox__caption">
              <span>{current.alt}</span>
              <span className="lightbox__count" aria-live="polite">
                {index! + 1} / {count}
              </span>
            </figcaption>
          </figure>

          <button type="button" className="lightbox__btn lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
            <ArrowLeftIcon />
          </button>
          <button type="button" className="lightbox__btn lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next photo">
            <ArrowRightIcon />
          </button>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default Lightbox;
