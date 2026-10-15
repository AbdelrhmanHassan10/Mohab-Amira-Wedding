import React, { useEffect, useRef } from 'react';
import './FlyingPetals.css';

/*
  Petals tossed in from the sides of the screen, drifting behind the page content.
  Everything runs on one canvas: petal images are drawn once into small sprites,
  then each frame just moves/rotates them, so it stays light even on phones.
*/

// site palette: lavender, purple, blush, cream, a touch of gold
const PETAL_COLORS: [string, string][] = [
  ['#e9dcf3', '#b99bd4'],
  ['#d9c3ec', '#8f6bb3'],
  ['#f6e1e6', '#dca9b8'],
  ['#fbf4ea', '#e6d3bb'],
  ['#f3e3c6', '#c9a468'],
];

interface Petal {
  sprite: HTMLCanvasElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  flip: number; // phase of the 3D "tumble" (squashes the petal as it turns)
  flipSpeed: number;
  sway: number; // phase of the side-to-side flutter
  swaySpeed: number;
  life: number; // seconds alive
  opacity: number;
}

const makeSprite = ([light, dark]: [string, string]) => {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.translate(size / 2, size / 2);

  // rounded petal with a small notch at the top, like a rose petal
  ctx.beginPath();
  ctx.moveTo(0, 26);
  ctx.bezierCurveTo(-24, 12, -22, -20, -6, -24);
  ctx.quadraticCurveTo(0, -18, 6, -24);
  ctx.bezierCurveTo(22, -20, 24, 12, 0, 26);
  ctx.closePath();

  const fill = ctx.createRadialGradient(-6, -8, 2, 0, 0, 30);
  fill.addColorStop(0, light);
  fill.addColorStop(1, dark);
  ctx.fillStyle = fill;
  ctx.fill();

  // faint centre vein for a bit of depth
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, 22);
  ctx.quadraticCurveTo(-2, 0, 0, -16);
  ctx.stroke();
  return c;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const FlyingPetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const sprites = PETAL_COLORS.map(makeSprite);
    const petals: Petal[] = [];
    let width = 0;
    let height = 0;
    let isSmall = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      isSmall = width < 700;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // one handful thrown in from the left or right edge
    const toss = (fromLeft: boolean) => {
      const count = isSmall ? Math.round(rand(4, 7)) : Math.round(rand(6, 10));
      const originY = rand(height * 0.05, height * 0.45);
      for (let i = 0; i < count; i++) {
        const speed = rand(isSmall ? 70 : 110, isSmall ? 150 : 240); // px per second
        petals.push({
          sprite: sprites[Math.floor(Math.random() * sprites.length)],
          x: fromLeft ? rand(-40, -10) : width + rand(10, 40),
          y: originY + rand(-40, 40),
          vx: (fromLeft ? 1 : -1) * speed,
          vy: rand(-70, -10), // a little upward at first, like a real throw
          size: rand(isSmall ? 14 : 18, isSmall ? 24 : 32),
          angle: rand(0, Math.PI * 2),
          spin: rand(-1.4, 1.4),
          flip: rand(0, Math.PI * 2),
          flipSpeed: rand(1.5, 3),
          sway: rand(0, Math.PI * 2),
          swaySpeed: rand(1, 2),
          life: 0,
          opacity: rand(0.75, 0.95),
        });
      }
    };

    let fromLeft = Math.random() > 0.5;
    let nextToss = 0.3; // seconds until the next handful
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      // clamp the step so a background tab coming back doesn't teleport petals
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      nextToss -= dt;
      const limit = isSmall ? 40 : 70;
      if (nextToss <= 0) {
        if (petals.length < limit) toss(fromLeft);
        fromLeft = !fromLeft;
        nextToss = rand(1.3, 2.3);
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.life += dt;
        p.sway += p.swaySpeed * dt;
        p.flip += p.flipSpeed * dt;
        p.angle += p.spin * dt;

        // air drag slows the throw, gentle gravity takes over, flutter adds sway
        p.vx *= 1 - 0.55 * dt;
        p.vy += 38 * dt;
        p.vy = Math.min(p.vy, 70);
        p.x += (p.vx + Math.sin(p.sway) * 22) * dt;
        p.y += p.vy * dt;

        // fade in quickly, fade out near the bottom of the screen
        const fadeIn = Math.min(p.life / 0.4, 1);
        const fadeOut = Math.min(Math.max((height - p.y) / (height * 0.25), 0), 1);
        const alpha = p.opacity * fadeIn * fadeOut;

        if (p.y > height + 40 || p.x < -80 || p.x > width + 80 || alpha <= 0.01 && p.life > 1) {
          petals.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.flip))); // tumbling in 3D
        ctx.drawImage(p.sprite, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      frame = requestAnimationFrame(tick);
    };

    // stop drawing while the tab is hidden, resume where it was
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="flying-petals" aria-hidden="true" />;
};

export default FlyingPetals;
