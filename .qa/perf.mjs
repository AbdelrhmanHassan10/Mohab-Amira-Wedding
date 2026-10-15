import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: "D:/projects/marwan's bro wed/.qa/profile", headless: 'new' });
const p = await b.newPage();
const errors = []; p.on('pageerror', e => errors.push(e.message));
const cdp = await p.createCDPSession();
for (const [w, h, cpu] of [[1440, 900, 1], [390, 844, 4]]) {
  await p.setViewport({ width: w, height: h, deviceScaleFactor: w < 700 ? 2 : 1 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  await p.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await p.evaluate(() => { window.__f = []; let l = performance.now(); const t = n => { window.__f.push(n - l); if (n - l > 40) (window.__long ||= []).push([Math.round(n - window.__t0), Math.round(n - l)]); l = n; if (window.__f.length < 2000) requestAnimationFrame(t); }; requestAnimationFrame(t); });
  await p.evaluate(() => { window.__t0 = performance.now(); }); await p.click(".gate__tap");
  await new Promise(r => setTimeout(r, 6500));
  const s = await p.evaluate(() => { const f = window.__f.slice(1); const avg = f.reduce((a, b) => a + b, 0) / f.length; return { long: window.__long, frames: f.length, avgMs: +avg.toFixed(1), fps: Math.round(1000 / avg), over50ms: f.filter(x => x > 50).length, worstMs: Math.round(Math.max(...f)) }; });
  console.log(w, `cpu x${cpu}`, s);
}
console.log('errors:', errors.length ? errors : 'none');
await b.close();
