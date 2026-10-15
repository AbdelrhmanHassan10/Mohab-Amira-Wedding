// Converts the photos in design-src/photos/ into responsive WebP files in public/images/
// and records the generated widths in src/content/image-manifest.json (read by <Photo>).
// Run after adding or changing a photo: node scripts/optimize-images.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SRC = 'design-src/photos';
const OUT = 'public/images';

// name -> source file and the widths to generate (never larger than the source)
const photos = {
  'hero-couple': { file: 'hero-couple.png', widths: [768, 1280, 1672], quality: 80 },
  'hero-sunset': { file: 'hero-sunset.png', widths: [640, 1024], quality: 80 },
  'mosque-golden': { file: 'mosque-golden.png', widths: [640, 1024], quality: 78 },
  'couple-waterfront': { file: 'couple-waterfront.png', widths: [480, 960] },
  'couple-lanternlight': { file: 'couple-lanternlight.png', widths: [480, 960] },
  'couple-garden': { file: 'couple-garden.png', widths: [480, 960] },
  'rings-gold': { file: 'rings-gold.jpg', widths: [480, 960, 1600] },
  'bouquet-white': { file: 'bouquet-white.jpg', widths: [480, 960, 1600] },
  'bouquet-cascade': { file: 'bouquet-cascade.jpg', widths: [480, 960, 1400] },
  'hands-rings': { file: 'hands-rings.jpg', widths: [480, 960, 1600] },
  'aisle-flowers': { file: 'aisle-flowers.jpg', widths: [480, 960, 1600] },
  'golden-hour-bouquet': { file: 'golden-hour-bouquet.jpg', widths: [480, 960, 1600] },
  'dusk-walk': { file: 'dusk-walk.jpg', widths: [480, 960, 1600] },
  'mosque-dusk': { file: 'mosque-dusk.jpg', widths: [480, 960] },
  'reception-hall': { file: 'reception-hall.jpg', widths: [480, 960] },
  'mosque-exterior': { file: 'mosque-exterior.png', widths: [640, 1280, 1537] },
  'mosque-interior': { file: 'mosque-interior.png', widths: [480, 960] },
  gatefold: { file: 'gatefold.png', widths: [64, 768, 1024], quality: 82 },
  childhood: { file: 'childhood.png', widths: [480, 960, 1145], quality: 80 },
  'garden-house': { file: 'garden-house.jpg', widths: [480, 960, 1600] },
};

await mkdir(OUT, { recursive: true });
const manifest = {};

for (const [name, { file, widths, quality = 76 }] of Object.entries(photos)) {
  const source = sharp(`${SRC}/${file}`).rotate();
  const { width: srcW, height: srcH } = await source.metadata();
  const made = [];
  for (const w of widths) {
    const width = Math.min(w, srcW);
    if (made.includes(width)) continue;
    const info = await source
      .clone()
      .resize({ width })
      .webp({ quality, effort: 6 })
      .toFile(`${OUT}/${name}-${width}.webp`);
    made.push(width);
    console.log(`${name}-${width}.webp`, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
  }
  manifest[name] = { widths: made, ratio: +(srcW / srcH).toFixed(4) };
}

await writeFile('src/content/image-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('src/content/image-manifest.json');
