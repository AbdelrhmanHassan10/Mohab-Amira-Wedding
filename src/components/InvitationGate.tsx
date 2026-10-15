import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { photoSrc } from './Photo';
import { lockScroll, unlockScroll } from './SmoothScroll';
import { COUPLE } from '../content/wedding';
import './InvitationGate.css';

interface InvitationGateProps {
  /** the tap: a user gesture, so the music is allowed to start here */
  onOpen?: () => void;
  /** the camera starts flying through the card toward the website */
  onZoom?: () => void;
  /** the gate has faded away and can be removed */
  onEnter: () => void;
}

/*
  Stage flow (like the first invitation):
  closed   - the gate-fold card from the photo, waiting for a tap
  unclasp  - the medallion clasp pops, the seam lights up and the clasp drops away
  opening  - the two doors swing open; the website shows through, far away
  open     - a short pause on that view
  leaving  - the camera flies through the card while the website grows to full size
*/
type Stage = 'closed' | 'unclasp' | 'opening' | 'open' | 'leaving';

const CLASP_MS = 900;
const DOORS_MS = 1600;
const HOLD_MS = 600;
export const ZOOM_S = 2;

const GATEFOLD = photoSrc('gatefold', 1024);
const GATEFOLD_SOFT = photoSrc('gatefold', 64);

const InvitationGate: React.FC<InvitationGateProps> = ({ onOpen, onZoom, onEnter }) => {
  const [stage, setStage] = useState<Stage>('closed');
  const gateRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);

  // page stays still behind the overlay; focus starts on the card
  useEffect(() => {
    lockScroll();
    window.scrollTo(0, 0);
    openRef.current?.focus({ preventScroll: true });
    return () => {
      timers.current.forEach(window.clearTimeout);
      unlockScroll();
    };
  }, []);

  // the opening in the card is cut where the card sits on screen, so the site shows through
  useLayoutEffect(() => {
    const measure = () => {
      const gate = gateRef.current;
      const card = openRef.current;
      if (!gate || !card) return;
      const r = card.getBoundingClientRect();
      gate.style.setProperty('--hole-x', `${r.left}px`);
      gate.style.setProperty('--hole-y', `${r.top}px`);
      gate.style.setProperty('--hole-w', `${r.width}px`);
      gate.style.setProperty('--hole-h', `${r.height}px`);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const enter = () => {
    timers.current.forEach(window.clearTimeout);
    onZoom?.();
    setStage('leaving');
  };

  const open = () => {
    if (stage !== 'closed') return;
    onOpen?.();
    setStage('unclasp');
    later(() => setStage('opening'), CLASP_MS);
    later(() => setStage('open'), CLASP_MS + DOORS_MS);
    later(enter, CLASP_MS + DOORS_MS + HOLD_MS);
  };

  const isOpen = stage !== 'closed';

  return (
    <AnimatePresence onExitComplete={onEnter}>
      {stage !== 'leaving' && (
        <m.div
          ref={gateRef}
          className={`gate gate--${stage}`}
          role="dialog"
          aria-modal="true"
          aria-label={`Invitation from ${COUPLE.first} and ${COUPLE.second}`}
          style={{ '--gatefold': `url(${GATEFOLD})`, '--gatefold-soft': `url(${GATEFOLD_SOFT})` } as React.CSSProperties}
          exit={{
            scale: 3.4,
            opacity: 0,
            transition: {
              scale: { duration: ZOOM_S, ease: [0.55, 0, 0.3, 1] },
              opacity: { duration: ZOOM_S * 0.45, delay: ZOOM_S * 0.5, ease: 'easeIn' },
            },
          }}
        >
          {/* the photo (with a soft blurred copy around it), cut open where the card stands */}
          <div className="gate__surface" aria-hidden="true">
            <div className="gate__backdrop" />
            <div className="gate__photo" />
          </div>

          <div className="gate__scene">
            {/* ── the two halves of the card in the photo, which swing open ── */}
            <div className="gate__door gate__door--left" aria-hidden="true">
              <span className="gate__door-face" />
              <span className="gate__door-patch" />
              <span className="gate__door-back" />
            </div>
            <div className="gate__door gate__door--right" aria-hidden="true">
              <span className="gate__door-face" />
              <span className="gate__door-patch" />
              <span className="gate__door-back" />
            </div>

            {/* the medallion clasp and tassel holding the doors shut */}
            <span className="gate__zip" aria-hidden="true" />
            <span className="gate__clasp" aria-hidden="true" />

            <button
              ref={openRef}
              type="button"
              className="gate__tap"
              onClick={open}
              disabled={isOpen}
              aria-label="Open the invitation"
            />
          </div>

          {isOpen && (
            <button type="button" className="gate__skip" onClick={enter}>
              Skip
            </button>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default InvitationGate;
