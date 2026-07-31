import puppeteer from 'puppeteer-core';
const S = '/private/tmp/claude-501/-Users-sagnikmitra-Desktop-GitHub-frontmatter/2e90ab3b-4a90-4362-bce4-042a842a2af5';
const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true, args: ['--no-sandbox','--disable-gpu'],
});
const p = await b.newPage();
await p.goto(`file://${S}/scratchpad/dossier-print.html`, {waitUntil:'networkidle0'});
const rows = await p.evaluate(() => {
  const out = [];
  document.querySelectorAll('.page').forEach((pg, i) => {
    const body = pg.querySelector('.body'), ft = pg.querySelector('.ft');
    if (!body || !ft) return;
    const slack = ft.getBoundingClientRect().top - body.getBoundingClientRect().bottom;
    const h2 = pg.querySelector('.sec h2');
    out.push({ page: i+1, slack: Math.round(slack), title: (h2?h2.textContent:'').slice(0,44) });
  });
  return out;
});
await b.close();
console.log('page  slack(px)  status  section');
for (const r of rows.sort((a,b)=>a.slack-b.slack))
  console.log(String(r.page).padStart(4), String(r.slack).padStart(9), '  ',
    (r.slack < 0 ? 'OVERFLOW' : r.slack < 24 ? 'tight   ' : 'ok      '), r.title);
