// Run with Playwright installed and EF_CHROMIUM_PATH pointing to Chromium, if needed.
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((q,r)=>{try{const u=new URL(q.url,'http://localhost');const f=path.join(root,u.pathname==='/'?'index.html':u.pathname);if(!f.startsWith(root+path.sep))throw Error('path');r.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':'application/octet-stream');r.end(fs.readFileSync(f))}catch{r.statusCode=404;r.end('not found')}});
(async()=>{let b;const results=[];try{
await new Promise(r=>server.listen(0,'127.0.0.1',r));b=await chromium.launch({executablePath:process.env.EF_CHROMIUM_PATH,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:390,height:844}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const file of ['index.html','evolufisico.html']){
await p.goto(`http://127.0.0.1:${server.address().port}/${file}`,{waitUntil:'networkidle'});
await p.evaluate(async()=>{await salvarAvaliacaoNoDB({id:'qa-theme',nome:'Teste de detalhes',peso:94.6,altura:183,data_avaliacao:'2026-10-16',dobras_resultado:{percGordura:13.5,massaMagra:81.8,massaGorda:12.8},bioimpedancia:{imc:28.2},dobras:{},perimetria:{},fotos:{}});abrirVisualizacaoPacienteWeb('qa-theme');});
for(const dark of [false,true]){
await p.evaluate(d=>{document.documentElement.classList.toggle('ef-dark-mode',d);document.body.classList.toggle('dark-mode',d)},dark);await p.waitForTimeout(400);
const colors=await p.evaluate(()=>{const style=s=>getComputedStyle(document.querySelector(s));return {surface:style('.patient-view-container').backgroundColor,card:style('#patient-view-content .stat-card').backgroundColor,title:style('#pv-aluno-nome').color,chart:style('#patient-view-content svg text').fill}});
assert.equal(colors.surface,dark?'rgb(21, 37, 31)':'rgb(249, 250, 247)');assert.notEqual(colors.surface,colors.title);assert.notEqual(colors.card,colors.chart);
if(dark)await p.screenshot({path:'/tmp/ef-details-dark.png',fullPage:false});results.push(file+': '+(dark?'escuro':'claro'));
}
await p.emulateMedia({media:'print'});assert.equal(await p.locator('.patient-view-container').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');results.push(file+': fundo de impressão preservado');await p.emulateMedia({media:'screen'});
}
assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'details-theme-results.json'),JSON.stringify({results,errors},null,2));console.log(results);
}finally{if(b)await b.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
