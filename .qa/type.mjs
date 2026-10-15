import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: "D:/projects/marwan's bro wed/.qa/profile", headless: 'new' });
const page = await browser.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
const wait = ms => new Promise(r => setTimeout(r, ms));
for (const [w, h] of [[1440, 900], [390, 844]]) {
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await page.click('.gate__skip').catch(async () => { await page.click('.gate__tap'); await wait(300); await page.click('.gate__skip'); });
  await wait(2800);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 300) { await page.evaluate(y => scrollTo(0, y), y); await wait(40); }
  await page.evaluate(() => scrollTo(0, 0)); await wait(800);
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(w, 'overflow', ov, 'fonts', await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).filter((v,i,a)=>a.indexOf(v)===i).join(',')));
  await page.screenshot({ path: `.qa/type-${w}.png`, fullPage: true });
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
