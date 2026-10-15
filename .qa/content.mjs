import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: "D:/projects/marwan's bro wed/.qa/profile", headless: 'new' });
const page = await browser.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
for (const [w, h] of [[1440, 900], [390, 844]]) {
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  for (const sel of ['#the-day', '#details', '#location']) {
    await page.evaluate(s => document.querySelector(s).scrollIntoView(), sel); await new Promise(r => setTimeout(r, 1300));
    const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return { y: b.top + scrollY, h: b.height }; }, sel);
    await page.screenshot({ path: `.qa/${sel.slice(1)}-${w}.png`, clip: { x: 0, y: r.y, width: w, height: r.h }, captureBeyondViewport: true });
  }
  const info = await page.evaluate(() => ({
    ov: document.documentElement.scrollWidth - innerWidth,
    hearts: [...document.querySelectorAll('.calendar__day--event')].map(e => e.textContent),
    links: [...document.querySelectorAll('.place__link')].map(a => a.href.slice(0, 70)),
  }));
  console.log(w, JSON.stringify(info));
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
