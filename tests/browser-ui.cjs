// Run with Playwright installed and EF_CHROMIUM_PATH pointing to Chromium, if needed.
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((q,r)=>{try{const u=new URL(q.url,'http://localhost');const f=path.join(root,u.pathname==='/'?'index.html':u.pathname);if(!f.startsWith(root+path.sep))throw Error('path');r.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':'application/octet-stream');r.end(fs.readFileSync(f))}catch{r.statusCode=404;r.end('not found')}});
(async()=>{
 let browser;const passed=[],errors=[];
 try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({executablePath:process.env.EF_CHROMIUM_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext();const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
 const url=`http://127.0.0.1:${server.address().port}`;await p.goto(url,{waitUntil:'networkidle'});
 assert.equal(await p.locator('.tab-panel.active').getAttribute('id'),'tab-painel');passed.push('Página inicial e navegação principal');
 assert.equal(await p.locator('#tab-btn-form').isVisible(),false);await p.locator('#tab-btn-history').click();
 await p.locator('#tab-btn-form').click();await p.locator('#nome').fill('Rascunho de teste');await p.locator('#tab-btn-history').click();await p.locator('#tab-btn-form').click();assert.equal(await p.locator('#nome').inputValue(),'Rascunho de teste');passed.push('Navegar preserva o rascunho');
 for(const width of [320,390,768,1199,1440,1920,2560]){
 await p.setViewportSize({width,height:900});
 const geometry=await p.evaluate(()=>{const rect=s=>document.querySelector(s).getBoundingClientRect();const brand=rect('.brand-wrapper'),actions=rect('#ef-primary-actions');return {overflow:document.documentElement.scrollWidth>innerWidth,overlap:brand.right>actions.left,steps:[...document.querySelectorAll('.step-indicator')].every(x=>{const r=x.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth})}});
 assert.deepEqual(geometry,{overflow:false,overlap:false,steps:true},`viewport ${width}`);passed.push(`Formulário e cabeçalho em ${width}px`);
 }
 await p.locator('#ef-professional-fields>summary').click();assert(await p.locator('#avaliador_nome').isVisible());passed.push('Dados profissionais acessíveis');
 for(const [button,panel] of [['tab-btn-painel','tab-painel'],['tab-btn-history','tab-historico'],['tab-btn-compare','tab-comparison'],['tab-btn-cobranca','tab-cobranca']]){await p.locator('#'+button).click();assert(await p.locator('#'+panel).isVisible());assert.equal(await p.locator('#tab-btn-form').isVisible(),panel==='tab-historico')}passed.push('Quatro áreas principais acessíveis');
 const navOrder=await p.locator('.top-navbar>.nav-tabs>.nav-tab-btn').evaluateAll(bs=>bs.map(b=>b.id));
 assert.deepEqual(navOrder,['tab-btn-painel','tab-btn-history','tab-btn-compare','tab-btn-lab77','tab-btn-cobranca']);passed.push('Calculadora entre Evolução e Cobranças na navegação principal');
 await p.locator('#tab-btn-lab77').click();assert(await p.locator('#tab-lab77').isVisible());assert.equal(await p.locator('#ef-tools-advanced #tab-btn-lab77').count(),0);passed.push('Calculadora acessível pela barra principal');
 await p.locator('#ef-support-section>summary').click();await p.locator('#tab-btn-diagnostics').click();assert(await p.locator('#tab-diagnostics').isVisible());passed.push('Diagnóstico acessível diretamente no menu');
 await p.locator('#tab-btn-history').click();await p.locator('#ef-history-export>summary').click();
 for(const width of [320,390,768,1199,1440,1920,2560]){
  await p.setViewportSize({width,height:900});
  assert.equal(await p.locator('#tab-historico .search-bar-container button[onclick="resetFormulario()"]').count(),0);
  const height=await p.locator('#tab-btn-form').evaluate(b=>b.getBoundingClientRect().height);
  assert(height<=48,'Nova avaliação esticou para '+height+'px em '+width+'px');
 }
 passed.push('Botão Nova avaliação mantém altura normal ao expandir exportação/importação');
 assert.equal(await p.locator('#btn-theme-toggle').isVisible(),false);await p.locator('#ef-preferences-section>summary').click();await p.locator('#btn-theme-toggle').click();await p.locator('#tab-btn-painel').click();await p.waitForTimeout(2000);await p.screenshot({path:'/tmp/ef-home-dark.png',fullPage:true});passed.push('Alternância de tema');
 assert.equal(await p.locator('#ef-tools>summary').count(),0);assert(await p.locator('#btn-theme-toggle').isVisible());await p.locator('#ef-preferences-section>summary').click();assert.equal(await p.locator('#btn-theme-toggle').isVisible(),false);passed.push('Seções laterais expandem e recolhem as funções');
 await p.evaluate(()=>navigator.serviceWorker.ready);await p.reload({waitUntil:'networkidle'});await context.setOffline(true);await p.reload({waitUntil:'networkidle'});await p.locator('#tab-btn-history').click();assert(await p.locator('#tab-btn-form').isVisible());await p.locator('#tab-btn-form').click();assert(await p.locator('#nome').isVisible());passed.push('Reabertura offline da SPA');
 assert.deepEqual(errors,[]);passed.push('Sem erros JavaScript no navegador');
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify({browser:browser.version(),passed,errors},null,2));console.log(JSON.stringify({passed:passed.length,checks:passed},null,2));
 }finally{if(browser)await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
