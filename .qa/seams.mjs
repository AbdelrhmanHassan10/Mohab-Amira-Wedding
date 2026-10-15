import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: "D:/projects/marwan's bro wed/.qa/profile", headless: 'new' });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]); // no Lenis, no reveal delays
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 800));
for (const [sel, edge] of [['#rsvp', 'top'], ['#story', 'top'], ['#story', 'bottom']]) {
  const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return { top: b.top + scrollY, bottom: b.bottom + scrollY }; }, sel);
  const y = (edge === 'top' ? r.top : r.bottom) - 160;
  await page.screenshot({ path: `.qa/seam-${sel.slice(1)}-${edge}.png`, clip: { x: 0, y, width: 1440, height: 320 }, captureBeyondViewport: true });
}
await browser.close();
console.log('ok');
