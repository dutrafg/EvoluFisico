// Run with Playwright installed and EF_CHROMIUM_PATH pointing to Chromium, if needed.
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((q,r)=>{try{const u=new URL(q.url,'http://localhost');const f=path.join(root,u.pathname==='/'?'index.html':u.pathname);if(!f.startsWith(root+path.sep))throw Error('path');r.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':'application/octet-stream');r.end(fs.readFileSync(f))}catch{r.statusCode=404;r.end('not found')}});
(async()=>{let browser;const results=[];try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({executablePath:process.env.EF_CHROMIUM_PATH||undefined,args:['--no-sandbox']});
 const p=await browser.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const file of ['index.html','evolufisico.html']){
 await p.goto(`http://127.0.0.1:${server.address().port}/${file}`,{waitUntil:'networkidle'});
 await p.waitForTimeout(1800);
 for(const simple of [true,false]){
 await p.evaluate(v=>document.body.classList.toggle('ef-simple-ui',v),simple);
 for(const width of [320,390,768,1440]){
 await p.setViewportSize({width,height:900});await p.locator('#tab-btn-cobranca').click();
 for(const mode of ['2','1']){
 await p.locator('#cob-btn-pessoa-'+mode).click();
 assert.equal(await p.locator('#cob-aluno2-wrapper').isVisible(),mode==='2');
 const bad=await p.evaluate(()=>[...document.querySelectorAll('.cob-segmented .cob-seg-btn,.cob-card-title>span,#cob-duo-alert .btn')].filter(x=>x.getClientRects().length).filter(x=>{const r=x.getBoundingClientRect(),c=x.closest('.cob-card').getBoundingClientRect();return r.left<c.left||r.right>c.right+1||x.scrollWidth>x.clientWidth+1}).map(x=>x.id||x.textContent.trim()));
 assert.deepEqual(bad,[],`${file} ${width} ${mode}`);
 }
 results.push(`${file}: individual/dupla em ${width}px, interface simples ${simple}`);
 }
 }
 await p.evaluate(()=>document.body.classList.add('ef-simple-ui'));
 await p.setViewportSize({width:390,height:900});await p.locator('#cob-btn-pessoa-2').click();await p.screenshot({path:'/tmp/ef-cobranca-fix.png',fullPage:true});
 await p.locator('#tab-btn-painel').click();
 assert(await p.locator('.top-navbar>.nav-tabs>.nav-tab-btn').evaluateAll(bs=>bs.every(b=>getComputedStyle(b).borderTopWidth==='1px')));
 await p.screenshot({path:'/tmp/ef-contornos.png',fullPage:true});results.push(`${file}: contorno no menu claro`);
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'billing-layout-results.json'),JSON.stringify({results,errors},null,2));console.log(results);
 }finally{if(browser)await browser.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
