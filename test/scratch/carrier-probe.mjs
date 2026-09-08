import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
const doc = [
"# T","",
'[mdmax-p-h1-9f2a]: mdmax:prov "src=spec.pdf#p12 box=72,640,468,668 m=text-layer c=1.0"',"",
"A paragraph.","",
"<!-- mdmax-p h1-9f2a src=spec.pdf#p12 -->","",
"Another paragraph.",""].join("\n");
const tree = unified().use(remarkParse).use(remarkGfm).parse(doc);
console.log("AST top-level:", tree.children.map(n=>n.type).join(", "));
const out = String(unified().use(remarkParse).use(remarkGfm).use(remarkStringify).processSync(doc));
console.log("md->md byte-identical:", out===doc);
console.log("definition survived md->md:", out.includes("mdmax-p-h1-9f2a"));
console.log("comment survived md->md:", out.includes("<!-- mdmax-p"));
const html = String(unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify).processSync(doc));
console.log("--- remark-rehype default (allowDangerousHtml:false) HTML ---");
console.log(JSON.stringify(html));
const html2 = String(unified().use(remarkParse).use(remarkGfm).use(remarkRehype,{allowDangerousHtml:true}).use(rehypeStringify,{allowDangerousHtml:true}).processSync(doc));
console.log("--- allowDangerousHtml:true HTML ---");
console.log(JSON.stringify(html2));
