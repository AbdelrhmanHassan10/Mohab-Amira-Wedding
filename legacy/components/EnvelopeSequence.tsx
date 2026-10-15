import React, { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import InvitationCover from './InvitationCover';
import { scrollToTopNow } from './SmoothScroll';
import './EnvelopeSequence.css';

interface EnvelopeSequenceProps {
  /* Card has landed on the page's InvitationCover: start the names animation */
  onReveal: () => void;
  /* Overlay has faded away and can be unmounted */
  onOpenComplete: () => void;
  /* Bow tapped: the first user gesture, so audio is allowed to start here */
  onStart?: () => void;
}

/*
  Stage flow (matches the reference video):
  0 - Gatefold envelope closed, ribbon + bow across the middle
  1 - Bow lifts and drops away, ribbon halves slide out to the sides
  2 - Left door swings open, then the right door
  3 - Card slowly zooms onto the page's InvitationCover while the envelope fades
  4 - Overlay background clears, names appear on the card, then the overlay is removed
*/

const RIBBON_FALL_MS = 1100;
const DOORS_OPEN_MS = 1800;
const ZOOM_MS = 2600;
// names animate on the card (and, in sync, on the page card beneath it) before the overlay goes
const HANDOFF_MS = 1700;

const EnvelopeSequence: React.FC<EnvelopeSequenceProps> = ({ onReveal, onOpenComplete, onStart }) => {
  const [stage, setStage] = useState(0);
  const [zoom, setZoom] = useState({ x: 0, y: 0, scale: 1 });
  const timers = useRef<number[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const introRef = useRef<HTMLElement>(null);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  // Block scrolling while the envelope is up. Done on the overlay rather than by toggling
  // body overflow, which repaints the whole page and flashes blank right at the handoff.
  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;
    const block = (e: Event) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.closest('input, textarea, [contenteditable]')) return;
      if ([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) e.preventDefault();
    };
    intro.addEventListener('wheel', block, { passive: false });
    intro.addEventListener('touchmove', block, { passive: false });
    window.addEventListener('keydown', blockKeys);
    return () => {
      intro.removeEventListener('wheel', block);
      intro.removeEventListener('touchmove', block);
      window.removeEventListener('keydown', blockKeys);
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  // Where the card must move and how much it must grow to sit exactly on the page's card
  // (phones: the full-screen card, tablet/desktop: the card in its column)
  const measureZoom = () => {
    const scene = sceneRef.current?.getBoundingClientRect();
    const letter = letterRef.current?.getBoundingClientRect();
    const target = document.querySelector('.landing-page .final-invitation')?.getBoundingClientRect();
    if (!scene || !letter || !target) return { x: 0, y: 0, scale: 1.1 };

    const scale = target.width / letter.width;
    const sceneCx = scene.left + scene.width / 2;
    const sceneCy = scene.top + scene.height / 2;
    const letterCx = letter.left + letter.width / 2;
    const letterCy = letter.top + letter.height / 2;
    return {
      x: target.left + target.width / 2 - sceneCx - scale * (letterCx - sceneCx),
      y: target.top + target.height / 2 - sceneCy - scale * (letterCy - sceneCy),
      scale,
    };
  };

  const startOpening = () => {
    if (stage !== 0) return;
    onStart?.();

    setStage(1);
    later(() => setStage(2), RIBBON_FALL_MS);
    later(() => {
      scrollToTopNow();
      setZoom(measureZoom());
      setStage(3);
    }, RIBBON_FALL_MS + DOORS_OPEN_MS);
    later(() => {
      setStage(4);
      onReveal();
    }, RIBBON_FALL_MS + DOORS_OPEN_MS + ZOOM_MS);
    later(onOpenComplete, RIBBON_FALL_MS + DOORS_OPEN_MS + ZOOM_MS + HANDOFF_MS);
  };

  return (
    <main ref={introRef} className="invitation-intro" data-stage={stage} data-lenis-prevent>
      <m.div
        ref={sceneRef}
        className="envelope-scene"
        initial={{ opacity: 0, y: 24 }}
        animate={stage >= 3 ? { opacity: 1, ...zoom } : { opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: stage >= 3 ? ZOOM_MS / 1000 : 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="envelope-shell" />

        {/* Card inside the envelope: never fades, it zooms onto the page card and gets its names there */}
        <div ref={letterRef} className="envelope-letter">
          <InvitationCover showNames={stage >= 4} showButton={false} className="mini-cover" />
        </div>

        {/* Gatefold doors */}
        <div className="envelope-door envelope-door-left">
          <div className="door-face door-front" />
          <div className="door-face door-back" />
        </div>
        <div className="envelope-door envelope-door-right">
          <div className="door-face door-front" />
          <div className="door-face door-back" />
        </div>

        {/* Ribbon (two halves that slide out to the sides) + bow */}
        <div className="envelope-ribbon-clip" aria-hidden="true">
          <div className="envelope-ribbon envelope-ribbon-left" />
          <div className="envelope-ribbon envelope-ribbon-right" />
        </div>
        <button
          className="bow-trigger"
          type="button"
          onClick={startOpening}
          disabled={stage !== 0}
          aria-label="Untie the ribbon and open the invitation"
        >
          <img className="bow-image" src="/bow.webp" alt="" />
        </button>
      </m.div>
    </main>
  );
};

export default EnvelopeSequence;
