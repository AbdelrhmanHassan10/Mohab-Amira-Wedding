import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: "D:/projects/marwan's bro wed/.qa/profile", headless: 'new' });
const page = await browser.newPage();
for (const w of [1024, 390]) {
  await page.setViewport({ width: w, height: 844 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  const r = await page.evaluate(() => {
    const W = innerWidth; const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const b = el.getBoundingClientRect();
      if (b.right > W + 1) out.push(`${el.tagName}.${(el.className?.baseVal ?? el.className) || ''} right=${Math.round(b.right)}`);
    }
    return { sw: document.documentElement.scrollWidth, W, out: out.slice(0, 12) };
  });
  console.log(w, JSON.stringify(r, null, 1));
}
await browser.close();
