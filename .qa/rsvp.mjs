import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: "D:/projects/marwan's bro wed/.qa/profile", headless: 'new' });
const page = await browser.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
for (const [w, h] of [[1440, 900], [768, 1024], [390, 844], [360, 740]]) {
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => document.querySelector('#rsvp').scrollIntoView()); await new Promise(r => setTimeout(r, 1500));
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const r = await page.evaluate(() => { const b = document.querySelector('#rsvp').getBoundingClientRect(); return { y: b.top + scrollY - 120, h: b.height + 120 }; });
  await page.screenshot({ path: `.qa/rsvp-${w}.png`, clip: { x: 0, y: r.y, width: w, height: r.h }, captureBeyondViewport: true });
  console.log(`w=${w} overflow=${ov}`);
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
