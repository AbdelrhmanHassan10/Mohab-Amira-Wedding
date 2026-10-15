import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: "D:/projects/marwan's bro wed/.qa/profile", headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 400, height: 400 });
for (const d of ['2', '4']) {
  await p.setContent(`<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500&display=block" rel="stylesheet"><body style="margin:0;background:#000"><div id=t style="font:500 240px/1 Cinzel;color:#fff;padding:30px;display:inline-block">${d}</div></body>`, { waitUntil: 'load', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);
  await (await p.$('#t')).screenshot({ path: `D:/tmp/digit-${d}.png` });
}
await b.close();
