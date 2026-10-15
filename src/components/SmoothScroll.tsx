import React, { useEffect } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

let lenis: Lenis | null = null;

/* Smooth-scrolls to an element through Lenis (native smooth scrolling would fight it) */
export const scrollToElement = (target: Element | null | undefined) => {
  if (!target) return;
  if (lenis) lenis.scrollTo(target as HTMLElement, { duration: 1.4 });
  else target.scrollIntoView({ behavior: 'smooth' });
};

/* Freezes page scrolling while a dialog (the photo viewer) is open */
export const lockScroll = () => {
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
};

export const unlockScroll = () => {
  document.documentElement.style.overflow = '';
  lenis?.start();
};

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  useEffect(() => {
    // leave scrolling native for people who asked the OS for less motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const instance = new Lenis({
      autoRaf: true,
      lerp: 0.12, // light and responsive; lower = floatier
      smoothWheel: true,
      wheelMultiplier: 1,
      // touch devices keep native scrolling, which is already smooth and saves battery
      syncTouch: false,
    });
    lenis = instance;

    return () => {
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
