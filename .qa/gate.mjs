import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: "D:/projects/marwan's bro wed/.qa/profile", headless: 'new' });
const page = await browser.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => m.type() === 'error' && errors.push(m.text()));
const wait = ms => new Promise(r => setTimeout(r, ms));
const t0 = { v: 0 };
for (const [w, h] of [[1440, 900], [390, 844]]) {
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await wait(900);
  await page.screenshot({ path: `.qa/gate-closed-${w}.png` });
  await page.click('.gate__tap');
  await wait(350);  await page.screenshot({ path: `.qa/gate-clasp-${w}.png` });
  await wait(1100); await page.screenshot({ path: `.qa/gate-mid-${w}.png` });
  await wait(1300); await page.screenshot({ path: `.qa/gate-open-${w}.png` });
  await wait(900);  await page.screenshot({ path: `.qa/gate-zoom-${w}.png` });
  await wait(2200);
  await page.screenshot({ path: `.qa/gate-after-${w}.png` });
  const after = await page.evaluate(() => ({ gate: !!document.querySelector('.gate'), petals: !!document.querySelector('.flying-petals'), ov: document.documentElement.scrollWidth - innerWidth, lock: document.documentElement.style.overflow, siteT: getComputedStyle(document.querySelector('.site')).transform, gated: document.documentElement.className }));
  await wait(1500); await page.screenshot({ path: `.qa/gate-petals-${w}.png` });
  console.log(w, after);
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
