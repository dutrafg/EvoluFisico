// Run with Playwright installed and EF_CHROMIUM_PATH pointing to Chromium, if needed.
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((q,r)=>{try{const u=new URL(q.url,'http://localhost');const f=path.join(root,u.pathname==='/'?'index.html':u.pathname);if(!f.startsWith(root+path.sep))throw Error('path');r.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':'application/octet-stream');r.end(fs.readFileSync(f))}catch{r.statusCode=404;r.end('not found')}});
(async()=>{let b;const results=[];try{
await new Promise(r=>server.listen(0,'127.0.0.1',r));b=await chromium.launch({executablePath:process.env.EF_CHROMIUM_PATH,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:390,height:844}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const file of ['index.html','evolufisico.html']){
await p.goto(`http://127.0.0.1:${server.address().port}/${file}`,{waitUntil:'networkidle'});
await p.evaluate(async()=>{await salvarAvaliacaoNoDB({id:'qa-theme',nome:'Teste de detalhes',peso:94.6,altura:183,data_avaliacao:'2026-10-16',dobras_resultado:{percGordura:13.5,massaMagra:81.8,massaGorda:12.8},bioimpedancia:{imc:28.2},dobras:{},perimetria:{},fotos:{}});abrirModalDetalhes('qa-theme');});
await p.waitForTimeout(600);
for(const width of [320,390,768,1440]){
await p.setViewportSize({width,height:844});
for(const dark of [false,true]){
await p.evaluate(d=>{document.documentElement.classList.toggle('ef-dark-mode',d);document.body.classList.toggle('dark-mode',d)},dark);
const bad=await p.evaluate(()=>[...document.querySelectorAll('#view-modal .modal-header button')].filter(x=>{const r=x.getBoundingClientRect(),p=x.closest('.modal-header').getBoundingClientRect();return r.left<p.left||r.right>p.right+1||x.scrollWidth>x.clientWidth+1||r.height<40}).map(x=>x.id));assert.deepEqual(bad,[]);
results.push(`${file} ${width}px ${dark?'escuro':'claro'}`);
if(width===390&&!dark){await p.waitForTimeout(500);await p.locator('#view-modal .modal-content').screenshot({path:'/tmp/ef-header-fixed.png'});}
}
}
await p.locator('#view-modal .modal-close-btn').click();assert(!(await p.locator('#view-modal').isVisible()));

}
assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'details-header-results.json'),JSON.stringify({results,errors},null,2));console.log(results);
}finally{if(b)await b.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
