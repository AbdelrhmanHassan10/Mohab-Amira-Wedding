// Builds the link-preview image (WhatsApp / Facebook) and the site icons in public/.
// Run after changing names, date or photos: node scripts/make-share-images.mjs
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SCRIPT_FONT = { fontfile: 'design-src/fonts/GreatVibes-Regular.ttf', family: 'Great Vibes' };
const SERIF_FONT = { fontfile: 'design-src/fonts/Cinzel.ttf', family: 'Cinzel' };

// renders one line of text as a transparent PNG
const text = (content, { fontfile, family }, size, color, spacing = 0) =>
  sharp({
    text: {
      text: `<span foreground="${color}" letter_spacing="${spacing * 1024}">${content}</span>`,
      font: `${family} ${size}`,
      fontfile,
      rgba: true,
      dpi: 72,
    },
  }).png().toBuffer({ resolveWithObject: true });

const photo = (file, height) =>
  sharp(file).trim({ threshold: 10 }).resize({ height }).png().toBuffer({ resolveWithObject: true });

/* ---------- 1200x630 link preview ---------- */
const W = 1200, H = 630, TX = 300; // names sit over the sky, left of the couple

const [eyebrow, groomName, amp, brideName, date] = await Promise.all([
  text("WE'RE GETTING MARRIED", SERIF_FONT, 17, '#DCC79C', 5),
  text('Mohab', SCRIPT_FONT, 92, '#F8F4EB'),
  text('&amp;', SCRIPT_FONT, 62, '#C6A66A'),
  text('Amira', SCRIPT_FONT, 92, '#F8F4EB'),
  text('24 · 10 · 2026', SERIF_FONT, 34, '#F8F4EB', 4),
]);

const centered = ({ data, info }, top) => ({ input: data, top, left: Math.round(TX - info.width / 2) });

// deep forest wash on the left so the ivory names read over the sunset sky
const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" x2="1">
    <stop offset="0" stop-color="#0D3029" stop-opacity="0.88"/>
    <stop offset="0.38" stop-color="#0D3029" stop-opacity="0.62"/>
    <stop offset="0.6" stop-color="#0D3029" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`);

// gold hairlines with a gold heart between them
const divider = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="20">
  <defs>
    <linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="#C6A66A" stop-opacity="0"/><stop offset="1" stop-color="#C6A66A"/></linearGradient>
    <linearGradient id="r" x1="1" x2="0"><stop offset="0" stop-color="#C6A66A" stop-opacity="0"/><stop offset="1" stop-color="#C6A66A"/></linearGradient>
  </defs>
  <rect x="0" y="9.5" width="92" height="1.2" fill="url(#l)"/>
  <rect x="128" y="9.5" width="92" height="1.2" fill="url(#r)"/>
  <path fill="#C6A66A" d="M110 17 C104 12.5 102.5 9.7 102.5 7.3 C102.5 5.1 104.2 3.5 106.2 3.5 C107.8 3.5 109.2 4.4 110 5.8 C110.8 4.4 112.2 3.5 113.8 3.5 C115.8 3.5 117.5 5.1 117.5 7.3 C117.5 9.7 116 12.5 110 17 Z"/>
</svg>`);

// the names block is stacked from the top; work out its height to centre it vertically
const gap = 6;
const blockHeight = eyebrow.info.height + 18 + groomName.info.height + amp.info.height - 24 +
  brideName.info.height + 14 + 20 + 18 + date.info.height;
let y = Math.round((H - blockHeight) / 2);
const layers = [];
layers.push(centered(eyebrow, y)); y += eyebrow.info.height + 18;
layers.push(centered(groomName, y)); y += groomName.info.height - 12;
layers.push(centered(amp, y)); y += amp.info.height - 12;
layers.push(centered(brideName, y)); y += brideName.info.height + 14;
layers.push({ input: divider, top: y, left: TX - 110 }); y += 20 + 18;
layers.push(centered(date, y + gap));

await sharp('public/images/hero-couple-1672.webp')
  .resize(W, H, { fit: 'cover', position: 'top' })
  .composite([{ input: shade }, ...layers])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile('public/og-image.jpg');
console.log('public/og-image.jpg');

/* ---------- icons: purple heart in a gold ring on ivory ---------- */
const icon = (size, padding) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  ${padding ? '<rect width="64" height="64" fill="#FAF7F2"/>' : ''}
  <circle cx="32" cy="32" r="${padding ? 24 : 29}" fill="#FAF7F2" stroke="#C5A059" stroke-width="${padding ? 2 : 3}"/>
  <path fill="#5b3d7a" transform="translate(32 33) scale(${padding ? 1.05 : 1.25}) translate(-32 -33)"
    d="M32 45 C20 36.5 17 31 17 26.3 C17 22 20.3 19 24.2 19 C27.4 19 30.3 20.8 32 23.6 C33.7 20.8 36.6 19 39.8 19 C43.7 19 47 22 47 26.3 C47 31 44 36.5 32 45 Z"/>
</svg>`);

await writeFile('public/favicon.svg', icon(64, false));
await sharp(icon(180, true)).png().toFile('public/apple-touch-icon.png');
await sharp(icon(32, false)).png().toFile('public/favicon-32.png');
console.log('public/favicon.svg, favicon-32.png, apple-touch-icon.png');
