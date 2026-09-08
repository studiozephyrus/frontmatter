import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import fs from "node:fs"; import path from "node:path";
function walk(d,out=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){if([".git","node_modules",".obsidian","graphify-out"].includes(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p,out);else if(e.name.endsWith(".md"))out.push(p);}return out;}
const files=walk(process.env.HOME+"/Desktop/GitHub/md");
const P=unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter,["yaml"]);
function txt(n){let s="";(function w(x){if(x.value)s+=x.value;(x.children||[]).forEach(w);})(n);return s;}
let paras=0,numeric=0,numericNoSrc=0,toolClaim=0,toolClaimNoOutput=0,deictic=0,deicticNoTarget=0;
const BIGNUM=/(\d[\d,]{2,}|\d+(\.\d+)?\s?%|\$\s?\d)/;
const TOOL=/\b(grep|search|scan|query|benchmark|test suite|measurement|profiling|analysis|the run|the log)\b[^.]{0,60}\b(showed|shows|returned|found|reported|confirmed|revealed|indicates?|indicated)\b/i;
const DEICTIC=/\b(as (shown|described|noted) (above|below)|see (above|below)|the (table|figure|chart|list) (above|below))\b/i;
for(const f of files){let s;try{s=fs.readFileSync(f,"utf8");}catch{continue;}
 let t;try{t=P.parse(s);}catch{continue;}
 const kids=t.children;
 for(let i=0;i<kids.length;i++){
   const n=kids[i]; if(n.type!=="paragraph") continue; paras++;
   const text=txt(n);
   const hasLink=JSON.stringify(n).includes('"link"')||/https?:\/\//.test(text);
   const near=(x)=>!!x&&(x.type==="code"||x.type==="table"||x.type==="blockquote");
   const ctx=near(kids[i-1])||near(kids[i+1]);
   if(BIGNUM.test(text)){numeric++; if(!hasLink&&!ctx)numericNoSrc++;}
   if(TOOL.test(text)){toolClaim++; if(!hasLink&&!ctx)toolClaimNoOutput++;}
   if(DEICTIC.test(text)){deictic++; if(!ctx)deicticNoTarget++;}
 }
}
const pc=(a,b)=>(100*a/b).toFixed(2)+"%";
console.log("paragraph blocks scanned:",paras);
console.log("A numeric-claim blocks:",numeric,pc(numeric,paras),"| unsourced:",numericNoSrc,pc(numericNoSrc,paras));
console.log("B tool-result assertions:",toolClaim,pc(toolClaim,paras),"| no output/link nearby:",toolClaimNoOutput,pc(toolClaimNoOutput,paras));
console.log("C deictic refs:",deictic,pc(deictic,paras),"| no adjacent target:",deicticNoTarget,pc(deicticNoTarget,paras));
