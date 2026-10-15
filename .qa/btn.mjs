import p from 'puppeteer-core';
const b=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',userDataDir:"D:/projects/marwan's bro wed/.qa/profile",headless:'new'});const pg=await b.newPage();
for (const w of [1440,1024,390]) {await pg.setViewport({width:w,height:900});await pg.goto('http://localhost:4321/',{waitUntil:'networkidle0'});await pg.click('.gate__tap');await new Promise(r=>setTimeout(r,300));await pg.click('.gate__skip');await new Promise(r=>setTimeout(r,2500));
console.log(w, await pg.evaluate(()=>[...document.querySelectorAll('.rsvp .btn, .event__title')].map(e=>e.textContent.trim().slice(0,20)+': h'+Math.round(e.getBoundingClientRect().height))));}
await b.close();
