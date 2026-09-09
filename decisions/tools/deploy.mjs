// Deploy decisions/ as a static Vercel deployment.
// Token comes from the environment (tokens.zsh sourced by the caller); never printed.
import fs from 'node:fs';
import path from 'node:path';

const TOKEN = process.env.VERCEL_TOKEN;
if (!TOKEN) { console.error('VERCEL_TOKEN missing'); process.exit(2); }
const TEAM = 'team_CDEATPKml1m8SIZSJ0DKdEjG';
const NAME = 'frontmatter-decisions';
const DIR = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/decisions';
const SHIP = ['index.html', 'app.css', 'app.js', 'diagram.js', 'questions.js', 'fonts.css'];

const H = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };
const api = (p) => `https://api.vercel.com${p}${p.includes('?') ? '&' : '?'}teamId=${TEAM}`;

const files = SHIP.map((f) => {
  const b = fs.readFileSync(path.join(DIR, f));
  return { file: f, data: b.toString('base64'), encoding: 'base64', bytes: b.length };
});
console.log('files:', files.map((f) => `${f.file} ${(f.bytes / 1024).toFixed(0)}KB`).join('  '));

const body = {
  name: NAME,
  files: files.map(({ file, data, encoding }) => ({ file, data, encoding })),
  target: 'production',
  projectSettings: { framework: null, buildCommand: null, outputDirectory: null, installCommand: null },
};

const r = await fetch(api('/v13/deployments'), { method: 'POST', headers: H, body: JSON.stringify(body) });
const j = await r.json();
if (!r.ok) { console.error('deploy failed', r.status, JSON.stringify(j).slice(0, 600)); process.exit(1); }
console.log('deployment', j.id, '->', j.url);

// Poll the deployment itself, not a URL — READY is the artifact's own state.
let state = j.readyState;
for (let i = 0; i < 60 && state !== 'READY' && state !== 'ERROR' && state !== 'CANCELED'; i++) {
  await new Promise((s) => setTimeout(s, 2000));
  const p = await fetch(api(`/v13/deployments/${j.id}`), { headers: H });
  state = (await p.json()).readyState;
}
console.log('state:', state);
if (state !== 'READY') process.exit(1);

// Deployment protection defaults ON for a new project; a login page returns 200 after a
// redirect, so this is checked without following redirects (LR: curl -sI, never -sL).
const pr = await fetch(api(`/v9/projects/${NAME}`), { headers: H });
const proj = await pr.json();
if (proj.ssoProtection) {
  console.log('ssoProtection is ON — disabling');
  const u = await fetch(api(`/v9/projects/${NAME}`), {
    method: 'PATCH', headers: H, body: JSON.stringify({ ssoProtection: null }),
  });
  console.log('patch:', u.status);
}

console.log('ALIASES:', (j.alias || []).join(' ') || '(none)');
