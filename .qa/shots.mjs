import puppeteer from 'puppeteer-core';
const [,, url, out, ...widths] = process.argv;
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  userDataDir: 'D:/projects/marwan\'s bro wed/.qa/profile', headless: 'new',
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
for (const w of widths.map(Number)) {
  await page.setViewport({ width: w, height: w < 700 ? 844 : 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  // walk the page so every reveal animation fires
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) { await page.evaluate(y => window.scrollTo(0, y), y); await new Promise(r => setTimeout(r, 60)); }
  await new Promise(r => setTimeout(r, 1500));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`w=${w} horizontal overflow=${overflow}px`);
  for (const sel of ['#details', '#story']) {
    const el = await page.$(sel);
    const box = await el.boundingBox();
    // include the wave edges that hang outside the story section
    const pad = sel === '#story' ? 100 : 0;
    await page.evaluate(y => window.scrollTo(0, y), box.y + (await page.evaluate(() => scrollY)) - pad - 10);
    await new Promise(r => setTimeout(r, 400));
    await el.screenshot({ path: `${out}/${sel.slice(1)}-${w}.png`, captureBeyondViewport: true });
  }
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
