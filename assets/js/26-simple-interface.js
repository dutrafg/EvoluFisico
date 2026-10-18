/* Interface 9.0-beta: reorganiza os mesmos controles, sem substituir suas funções. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const expanded=new Map();
const routes={
 'tab-painel':['tab-btn-painel','Início'],
 'tab-historico':['tab-btn-history','Avaliações'],
 'tab-comparison':['tab-btn-compare','Evolução'],
 'tab-cobranca':['tab-btn-cobranca','Cobranças'],
 'tab-novo-checkin':['tab-btn-form','Nova avaliação'],
 'tab-lab77':['tab-btn-lab77','Calculadora'],
 'tab-diagnostics':['tab-btn-diagnostics','Diagnóstico']
};
function fold(id,title,hint,nodes,parent,before=null){
 let d=$(id);if(!d){d=document.createElement('details');d.id=id;d.className='ef-simple-fold';d.open=expanded.get(id)||false;
 const summary=document.createElement('summary');const label=document.createElement('span');label.textContent=title;summary.append(label);
 if(hint){const sub=document.createElement('small');sub.textContent=hint;summary.append(sub)}d.append(summary);
 const content=document.createElement('div');content.className='ef-simple-fold-content';d.append(content);
 d.addEventListener('toggle',()=>expanded.set(id,d.open));parent.insertBefore(d,before);}
 const content=d.querySelector('.ef-simple-fold-content');nodes.filter(Boolean).forEach(n=>{if(n.parentNode!==content)content.append(n)});return d;
}
function arrangeNavigation(){
 const nav=document.querySelector('.top-navbar > .nav-tabs'),menu=$('ef-tools-content'),actions=$('ef-primary-actions');if(!nav||!menu||!actions)return;
 ['tab-painel','tab-historico','tab-comparison','tab-lab77','tab-cobranca'].forEach(route=>{const b=$(routes[route][0]);if(b&&b.parentNode!==nav)nav.append(b)});
 ['tab-diagnostics'].forEach(route=>{const b=$(routes[route][0]);if(b&&b.parentNode!==$('ef-tools-advanced'))$('ef-tools-advanced').append(b)});
 const form=$('tab-btn-form');if(form&&form.parentNode!==actions)actions.prepend(form);
 for(const [route,[id,label]] of Object.entries(routes)){
  const b=$(id);if(!b)continue;b.type='button';b.setAttribute('aria-controls',route);
  // Keep the form icon/label and history count IDs used by existing code.
  if(id==='tab-btn-history'){
   if(!b.dataset.simpleLabel){const count=$('history-counter');b.replaceChildren(document.createTextNode('Avaliações '));if(count){count.classList.add('ef-nav-count');b.append(count)}b.dataset.simpleLabel='1';}
  }else if(id==='tab-btn-form'){
   if($('tab-form-label'))$('tab-form-label').textContent=$('avaliacao_id')?.value?'Editar avaliação':label;
   if($('tab-form-icon'))$('tab-form-icon').textContent='+';
  }else if(b.textContent!==label)b.textContent=label;
  const active=$(route)?.classList.contains('active');b.classList.toggle('active',!!active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
 }
 const active=document.querySelector('.tab-panel.active');
 if(form)form.hidden=active?.id!=='tab-historico';
 const heading=$('ef-workspace-title');if(heading)heading.textContent=routes[active?.id]?.[1]||'EvoluFísico';
 $('ef-tools').classList.toggle('ef-tools-active',active?.id==='tab-diagnostics');
}
function arrangeDetails(){
 const panel=$('ef55-painel');if(panel){
  const nodes=[$('ef68-insights'),$('ef70-engine')].filter(Boolean);
  if(nodes.length)fold('ef-home-analysis','Análises detalhadas','Tendências, indicadores e sugestões',nodes,panel);
 }
 const patient=$('patient-view-content');if(patient){
  const nodes=[$('ef71-profile'),$('ef72-comparison'),$('ef73-monitoring')].filter(Boolean);
  if(nodes.length)fold('ef-patient-analysis','Explorar a evolução','Perfil, comparação e monitoramento',nodes,patient);
 }
}
function setupForm(){
 const live=$('live-kpi-summary');if(live)fold('ef-live-results','Resultados em tempo real','Composição corporal e índices calculados',[live],live.parentNode,live);
 const step1=document.querySelector('.step[data-step="1"]');
 const pro=$('avaliador_nome')?.closest('.input-row');if(pro&&step1?.contains(pro)){const heading=pro.previousElementSibling;if(heading?.classList.contains('section-subhead'))heading.remove();fold('ef-professional-fields','Dados do profissional','Nome e registro para os relatórios',[pro],step1,pro);}
 const step3=document.querySelector('.step[data-step="3"]');if(step3){
  const titles=[...step3.querySelectorAll(':scope > .section-subhead')];
  const groups=titles.map((title,i)=>{const nodes=[];let n=title.nextElementSibling;while(n&&n!==titles[i+1]){nodes.push(n);n=n.nextElementSibling}return {title,nodes,i}});
  groups.forEach(({title,nodes,i})=>{const d=fold('ef-method-'+i,i?'Bioimpedância':'Dobras cutâneas',i?'Resultados do aparelho, quando disponíveis':'Protocolo de 7 dobras e resultados',nodes,step3,title);if(!i)d.open=true;title.remove()});
 }
 const stats=document.querySelector('#tab-historico > .dashboard-kpi-grid');if(stats)fold('ef-history-summary','Resumo das avaliações','Totais, médias e registros com fotos',[stats],stats.parentNode,stats);
 const bar=document.querySelector('#tab-historico .search-bar-container');
 if(bar){const row=bar.querySelector(':scope > div:last-child');if(row){const items=[...row.children].filter(n=>!n.matches('button[onclick="resetFormulario()"]'));if(items.length)fold('ef-history-export','Exportar ou importar','Backup, planilha e restauração',items,row);}}
 document.querySelectorAll('.step-indicator').forEach(b=>{b.setAttribute('role','button');b.tabIndex=0;b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();b.click()}})});
 document.addEventListener('invalid',e=>{let n=e.target;while(n){if(n.tagName==='DETAILS')n.open=true;n=n.parentElement}},true);
}
function mount(){
 document.body.classList.add('ef-simple-ui');
 const header=document.querySelector('.top-navbar'),nav=header?.querySelector(':scope > .nav-tabs'),oldActions=header?.querySelector(':scope > .nav-actions');if(!header||!nav||!oldActions)return;
 nav.setAttribute('aria-label','Navegação principal');
 const workspace=document.createElement('div');workspace.id='ef-workspace-heading';
 const title=document.createElement('span');title.id='ef-workspace-title';workspace.append(title);
 const version=document.createElement('small');version.textContent='9.0-beta';workspace.append(version);header.after(workspace);
 const actions=document.createElement('div');actions.id='ef-primary-actions';
 const tools=document.createElement('details');tools.id='ef-tools';
 const summary=document.createElement('summary');summary.textContent='Ferramentas';summary.setAttribute('aria-label','Abrir ferramentas e configurações');tools.append(summary);
 const content=document.createElement('div');content.id='ef-tools-content';
 const advanced=document.createElement('div');advanced.id='ef-tools-advanced';advanced.className='ef-tools-group';
 const heading=document.createElement('p');heading.textContent='Avaliação e suporte';advanced.append(heading);content.append(advanced);
 const heading2=document.createElement('p');heading2.textContent='Dados e preferências';content.append(heading2);
 oldActions.classList.add('ef-tools-group');content.append(oldActions);tools.append(content);actions.append(tools);header.append(actions);
 const brand=header.querySelector('.brand-wrapper');brand.onclick=e=>{e.preventDefault();window.switchTab('tab-painel')};
 setupForm();arrangeNavigation();arrangeDetails();
 const oldSwitch=window.switchTab;window.switchTab=function(id){const result=oldSwitch.apply(this,arguments);tools.open=false;arrangeNavigation();queueMicrotask(arrangeDetails);return result};
 let pending=false;const observer=new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;arrangeNavigation();arrangeDetails()})});
 observer.observe(nav,{childList:true});observer.observe(advanced,{childList:true});
 ['ef55-painel','patient-view-content'].forEach(id=>{if($(id))observer.observe($(id),{childList:true,subtree:true})});
 document.addEventListener('click',e=>{if(tools.open&&!tools.contains(e.target))tools.open=false});
 content.addEventListener('click',e=>{if(e.target.closest('button'))tools.open=false});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&tools.open){tools.open=false;summary.focus()}});
 // Returning to a draft never resets its fields. Initial home is only a navigation change.
 window.switchTab('tab-painel');
 let printStates=[];window.addEventListener('beforeprint',()=>{printStates=[...document.querySelectorAll('details.ef-simple-fold')].map(d=>[d,d.open]);printStates.forEach(([d])=>d.open=true)});
 window.addEventListener('afterprint',()=>{printStates.forEach(([d,open])=>d.open=open);printStates=[]});
 const edit=window.editarAvaliacao;if(typeof edit==='function')window.editarAvaliacao=function(){const r=edit.apply(this,arguments);const bia=$('ef-method-1');if(bia)bia.open=[...bia.querySelectorAll('input,textarea')].some(x=>x.value.trim());return r};
 window.EFSimpleUI={version:'9.0-beta',arrangeNavigation,arrangeDetails};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
