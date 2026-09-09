import { spawn } from 'node:child_process'; import fs from 'node:fs';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT='/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/screens';
const B='https://frontmatter-decisions-sagnik.vercel.app';
const SHOTS=[['final-overview',`${B}/?x=1`,1440,1000],['final-engine',`${B}/?x=1#E1`,1440,1400],
             ['final-market',`${B}/?x=1#MK1`,1440,1400],['final-phone',`${B}/?x=1#E1`,500,950]];
function shoot(n,url,w,h){return new Promise((res,rej)=>{const f=`${OUT}/dec-${n}.png`;
 if(fs.existsSync(f))fs.unlinkSync(f);
 const p=spawn(CHROME,['--headless','--disable-gpu','--no-sandbox','--hide-scrollbars',
  `--window-size=${w},${h}`,'--force-device-scale-factor=2','--virtual-time-budget=10000',
  `--screenshot=${f}`,url],{detached:true,stdio:'ignore'}); p.unref();
 const t0=Date.now(); const iv=setInterval(()=>{
  if(fs.existsSync(f)&&fs.statSync(f).size>20000){const sz=fs.statSync(f).size;
   const fd=fs.openSync(f,'r');const b=Buffer.alloc(12);fs.readSync(fd,b,0,12,sz-12);fs.closeSync(fd);
   if(b.includes(Buffer.from('IEND'))){clearInterval(iv);try{process.kill(-p.pid,'SIGKILL')}catch{};
    return res(`${n} ${(sz/1024).toFixed(0)}KB`)}}
  if(Date.now()-t0>50000){clearInterval(iv);try{process.kill(-p.pid,'SIGKILL')}catch{};rej(new Error(n+' timeout'))}
 },400)})}
for(const s of SHOTS) console.log('ok  ', await shoot(...s));
