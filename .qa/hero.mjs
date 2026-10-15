import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: "D:/projects/marwan's bro wed/.qa/profile", headless: 'new' });
const page = await browser.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
for (const [w, h] of [[1440, 900], [1024, 768], [390, 844], [360, 740]]) {
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2800));
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const src = await page.evaluate(() => document.querySelector('.hero__photo').currentSrc.split('/').pop());
  console.log(`w=${w} overflow=${ov}px src=${src}`);
  await page.screenshot({ path: `.qa/hero-${w}.png` });
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
