import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: "D:/projects/marwan's bro wed/.qa/profile", headless: 'new' });
const page = await browser.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
for (const [w, h] of [[1440, 900], [390, 844]]) {
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.getElementById('gallery').scrollIntoView());
  await new Promise(r => setTimeout(r, 2500));
  const x1 = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.marquee__track')).transform).m41);
  await new Promise(r => setTimeout(r, 1500));
  const x2 = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.marquee__track')).transform).m41);
  const info = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    tabbable: document.querySelectorAll('.marquee__open[tabindex="0"]').length,
    items: document.querySelectorAll('.marquee__item').length,
  }));
  console.log(`w=${w} moving=${x1 !== x2} (${x1.toFixed(1)} -> ${x2.toFixed(1)})`, JSON.stringify(info));
  const el = await page.$('#gallery');
  await el.screenshot({ path: `.qa/gallery-${w}.png` });
  // pause button stops it
  await page.click('.gallery__toggle'); await new Promise(r => setTimeout(r, 300));
  const p1 = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.marquee__track')).transform).m41);
  await new Promise(r => setTimeout(r, 800));
  const p2 = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.marquee__track')).transform).m41);
  console.log(`  paused=${p1 === p2} label="${await page.$eval('.gallery__toggle', b => b.getAttribute('aria-label'))}"`);
  // click a photo -> lightbox, Esc closes
  await page.click('.gallery__toggle');
  await page.$eval('.marquee__item:nth-child(3) .marquee__open', b => b.click()); await new Promise(r => setTimeout(r, 500));
  const lb = await page.$eval('.lightbox__count', e => e.textContent).catch(() => 'none');
  await page.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 500));
  console.log(`  lightbox from photo 3: ${lb}; closed=${!(await page.$('.lightbox'))}`);
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
