// Quick asset copy helper — run with: node scripts/copy-assets.mjs
import { copyFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pub = resolve(root, 'public');
const brain = 'C:\\Users\\AT\\.gemini\\antigravity-ide\\brain\\057f846a-de45-4464-80b2-d48fee31f8b5';

const copies = [
  // Generated images → public
  [resolve(brain, 'hero_sunset_1791981671289.png'), resolve(pub, 'hero-bg.png')],
  [resolve(brain, 'mosque_golden_1791982094155.png'), resolve(pub, 'mosque.png')],
  // Existing project root images → public
  [resolve(root, 'Romantic Sunset Couple by the Waterfront.png'), resolve(pub, 'couple-sunset.png')],
  [resolve(root, 'Better Together by Lanternlight.png'), resolve(pub, 'couple-lantern.png')],
  [resolve(root, 'ChatGPT Image Oct 13, 2026, 03_02_29 AM.png'), resolve(pub, 'couple-art.png')],
  [resolve(root, '2.jpeg'), resolve(pub, 'photo-2.jpeg')],
  [resolve(root, '3.png'), resolve(pub, 'photo-3.png')],
  [resolve(root, '4.jpeg'), resolve(pub, 'bride-solo.jpeg')],
  [resolve(root, '5.jpeg'), resolve(pub, 'groom-solo.jpeg')],
];

let copied = 0;
for (const [src, dest] of copies) {
  if (existsSync(src)) {
    try {
      copyFileSync(src, dest);
      console.log(`✓ ${src.split(/[\\/]/).pop()} → ${dest.split(/[\\/]/).pop()}`);
      copied++;
    } catch (e) { console.error(`✗ ${src.split(/[\\/]/).pop()}: ${e.message}`); }
  } else {
    console.log(`⊘ Not found: ${src.split(/[\\/]/).pop()}`);
  }
}
console.log(`\nDone: ${copied} files copied.`);
