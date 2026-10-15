// Shared, calm motion settings so every section enters the same way

// soft ease-out: starts gently moving and settles slowly, never snaps
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

/* Fade-up as a block scrolls into view (once). Spread onto an <m.*> element: <m.div {...reveal()} /> */
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 1.1, ease: EASE_SOFT, delay },
});
