/* 04-runtime.js */
(function(){'use strict';
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var norm=function(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()};
var pd=function(s){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s||'');return m?new Date(+m[1],+m[2]-1,+m[3]):null};
var fd=function(d){return d?d.toLocaleDateString('pt-BR'):'—'};
var num=function(v){var n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:null};
var lista=function(){try{return Array.isArray(avaliacoes)?avaliacoes:[]}catch(e){return[]}};
var pg=function(a){var r=a.dobras_resultado&&num(a.dobras_resultado.percGordura);return r!=null?r:num(a.bioimpedancia&&a.bioimpedancia.pgordura)};
var mm=function(a){return EFMeasures.lean(a)};
var ini=function(n){var p=String(n||'?').trim().split(/\s+/);return(p[0][0]+(p.length>1?p[p.length-1][0]:'')).toUpperCase()};

function toast(msg,tipo){var c=$('#ef55-toasts');if(!c){c=document.createElement('div');c.id='ef55-toasts';c.className='no-print';document.body.appendChild(c)}
var t=document.createElement('div');t.className='ef55-toast '+(tipo||'');t.textContent=msg;t.style.cursor='pointer';t.onclick=function(){t.remove()};c.appendChild(t);
setTimeout(function(){t.classList.add('out');setTimeout(function(){t.remove()},300)},4200)}
window.efToast=toast;

function alunos(){var m={};lista().forEach(function(a){var k=EFIdentity.key(a);if(k)(m[k]=m[k]||[]).push(a)});
return Object.keys(m).map(function(k){var l=m[k].sort(function(x,y){return(x.data_avaliacao||'').localeCompare(y.data_avaliacao||'')});return{nome:l[l.length-1].nome,list:l,first:l[0],last:l[l.length-1]}})}

function abrir(id){var fn=['abrirModalDetalhes','verDetalhesAvaliacao','visualizarAvaliacao','abrirDetalhesAvaliacao','verAvaliacao'].filter(function(n){return typeof window[n]==='function'})[0];
if(fn)window[fn](id);else window.switchTab('tab-historico')}
window.ef55Abrir=abrir;
window.ef55Zap=function(ev,id){ev.stopPropagation();var a=lista().filter(function(x){return x.id===id})[0];if(!a)return;
var d=String(a.whatsapp||'').replace(/\D/g,'');if(!d){toast('Aluno sem WhatsApp cadastrado.','warn');return}
var msg='Olá, '+String(a.nome).split(' ')[0]+'! Sua reavaliação física está prevista para '+fd(pd(a.data_proxima_avaliacao))+'. Vamos agendar o melhor horário?';
window.open('https://api.whatsapp.com/send?phone='+(d.length<=11?'55':'')+d+'&text='+encodeURIComponent(msg),'_blank','noopener,noreferrer')};

function chip(v,un,bomSeNeg){if(v==null||isNaN(v))return'';var cls=Math.abs(v)<0.05?'':((v<0)===bomSeNeg?'ok':'bad');
return'<span class="ef55-pill '+cls+'">'+(v>0?'+':'')+v.toFixed(1)+un+'</span>'}

function render(){var box=$('#ef55-painel');if(!box)return;
var al=alunos(),av=lista(),h=new Date();h=new Date(h.getFullYear(),h.getMonth(),h.getDate());
var mes=av.filter(function(a){var d=pd(a.data_avaliacao);return d&&d.getMonth()===h.getMonth()&&d.getFullYear()===h.getFullYear()}).length;
var gs=al.map(function(x){return pg(x.last)}).filter(function(v){return v!=null});
var media=gs.length?(gs.reduce(function(s,v){return s+v},0)/gs.length).toFixed(1)+'%':'--';
var ret=al.map(function(x){var d=pd(x.last.data_proxima_avaliacao);return d?{x:x,dias:Math.round((d-h)/864e5)}:null}).filter(function(r){return r&&r.dias<=14}).sort(function(a,b){return a.dias-b.dias});
var atr=ret.filter(function(r){return r.dias<0}).length;
var kp=function(t,v,s){return'<div class="ef55-card ef55-kpi"><small>'+t+'</small><b>'+v+'</b><span>'+s+'</span></div>'};
var rows=function(arr,fn){return arr.length?arr.map(fn).join(''):'<div class="ef55-empty">Nada por aqui ainda.</div>'};
var evo=al.filter(function(x){return x.list.length>1}).sort(function(a,b){return(b.last.data_avaliacao||'').localeCompare(a.last.data_avaliacao||'')}).slice(0,6);
var rec=av.slice().sort(function(a,b){return(b.data_avaliacao||'').localeCompare(a.data_avaliacao||'')}).slice(0,6);
box.innerHTML='<div class="ef55-head"><div><h1>Seu acompanhamento</h1><p>Veja os próximos retornos e retome suas avaliações.</p></div>'+
'<button class="btn btn-primary btn-sm" onclick="switchTab(\'tab-historico\')">Ver avaliações</button></div>'+
'<div class="ef55-kpis">'+kp('Alunos',al.length,'cadastrados')+kp('Avaliações',av.length,mes+' neste mês')+kp('% Gordura média',media,'última avaliação de cada aluno')+kp('Retornos pendentes',ret.length,atr+' em atraso')+'</div>'+
'<div class="ef55-cols"><div class="ef55-card"><h3>Reavaliações (próx. 14 dias)<em>'+ret.length+'</em></h3>'+
rows(ret,function(r){var a=r.x.last,c=r.dias<0?'bad':r.dias<=3?'warn':'ok',tx=r.dias<0?'Atrasado '+(-r.dias)+'d':r.dias===0?'Hoje':'em '+r.dias+'d';
return'<div class="ef55-row" onclick="ef55Abrir(\''+esc(a.id)+'\')"><div class="ef55-av">'+esc(ini(a.nome))+'</div><div class="t"><b>'+esc(a.nome)+'</b><span>'+fd(pd(a.data_proxima_avaliacao))+'</span></div><span class="ef55-pill '+c+'">'+tx+'</span><button class="ef55-wa" onclick="ef55Zap(event,\''+esc(a.id)+'\')">WhatsApp</button></div>'})+'</div>'+
'<div class="ef55-card"><h3>Evolução (1ª → última)<em>'+evo.length+'</em></h3>'+
rows(evo,function(x){var f=x.first,l=x.last;return'<div class="ef55-row" onclick="ef55Abrir(\''+esc(l.id)+'\')"><div class="ef55-av">'+esc(ini(x.nome))+'</div><div class="t"><b>'+esc(x.nome)+'</b><span>'+x.list.length+' avaliações · '+fd(pd(l.data_avaliacao))+'</span></div><div class="ef55-chips">'+
chip(pg(l)-pg(f),'% gord.',true)+chip(num(l.peso)-num(f.peso),' kg',true)+chip(mm(l)-mm(f),' kg MM',false)+'</div></div>'})+'</div>'+
'<div class="ef55-card"><h3>Avaliações recentes<em>'+rec.length+'</em></h3>'+
rows(rec,function(a){var g=pg(a);return'<div class="ef55-row" onclick="ef55Abrir(\''+esc(a.id)+'\')"><div class="ef55-av">'+esc(ini(a.nome))+'</div><div class="t"><b>'+esc(a.nome)+'</b><span>'+fd(pd(a.data_avaliacao))+(a.fase?' · '+esc(a.fase):'')+'</span></div><span class="ef55-pill">'+(g!=null?g.toFixed(1)+'% gord.':'—')+'</span></div>'})+'</div></div>'}

var nav=$('.nav-tabs');
if(nav){nav.insertAdjacentHTML('afterbegin','<button class="nav-tab-btn" id="tab-btn-painel" onclick="switchTab(\'tab-painel\')"><span>📊</span> <span>Painel</span></button>')}
var first=$('#tab-novo-checkin');
if(first)first.insertAdjacentHTML('beforebegin','<section id="tab-painel" class="tab-panel"><div id="ef55-painel"></div></section>');
var _sw=window.switchTab;
window.switchTab=function(id){_sw(id);if(id==='tab-painel'){document.querySelectorAll('.nav-tab-btn').forEach(function(b){b.classList.remove('active')});$('#tab-btn-painel').classList.add('active');render()}};

var pal=document.createElement('div');pal.id='ef55-pal';pal.className='no-print';
pal.innerHTML='<div class="box"><input id="ef55-q" placeholder="Buscar aluno ou ação…" autocomplete="off"><ul id="ef55-l"></ul><div class="foot">↑↓ navegar · Enter abrir · Esc fechar</div></div>';document.body.appendChild(pal);
var acoes=[['✨ Rever Abertura','Alt+0',function(){reabrirAbertura()}],['📊 Painel','Alt+1',function(){window.switchTab('tab-painel')}],['📝 Nova Avaliação','Alt+2',function(){window.switchTab('tab-novo-checkin')}],['📋 Histórico de Avaliações','Alt+3',function(){window.switchTab('tab-historico')}],['⚖️ Comparar Evolução','Alt+4',function(){window.switchTab('tab-comparison')}],
['⬇️ Fazer Backup (JSON)','',function(){if(window.abrirModalCentralBackup)window.abrirModalCentralBackup('exportar');else window.exportarBackupJSON()}],['⬆️ Importar Backup','',function(){if(window.abrirModalCentralBackup)window.abrirModalCentralBackup('importar');else{var i=$('#import-file-input');if(i)i.click()}}],['🛡️ Central de Backup','',function(){if(window.abrirModalCentralBackup)window.abrirModalCentralBackup('exportar');else window.exportarBackupJSON()}],['🔐 Segurança / Chave Mestra','',function(){abrirConfiguracaoCriptografia()}],['👨‍⚕️ Dados do Profissional / CREF','',function(){if(window.abrirModalConfigProfissional)window.abrirModalConfigProfissional()}]];
var itens=[],sel=0;
function lerPal(){var q=norm($('#ef55-q').value);
itens=acoes.filter(function(a){return!q||norm(a[0]).indexOf(q)>-1}).map(function(a){return{t:a[0],k:a[1],f:a[2]}});
if(q)alunos().filter(function(x){return norm(x.nome).indexOf(q)>-1}).slice(0,8).forEach(function(x){itens.push({t:'👤 '+x.nome,k:x.list.length+' aval.',f:function(){abrir(x.last.id)}})});
sel=0;pintar()}
function pintar(){$('#ef55-l').innerHTML=itens.length?itens.map(function(i,n){return'<li data-n="'+n+'" class="'+(n===sel?'sel':'')+'">'+esc(i.t)+'<small>'+esc(i.k)+'</small></li>'}).join(''):'<li>Nenhum resultado</li>'}
function abrirPal(){pal.classList.add('open');$('#ef55-q').value='';lerPal();$('#ef55-q').focus()}
function fecharPal(){pal.classList.remove('open')}
function exec(n){var i=itens[n];if(!i)return;fecharPal();i.f()}
$('#ef55-q').addEventListener('input',lerPal);
$('#ef55-l').addEventListener('click',function(e){var li=e.target.closest('li[data-n]');if(li)exec(+li.dataset.n)});
pal.addEventListener('mousedown',function(e){if(e.target===pal)fecharPal()});
document.addEventListener('keydown',function(e){
if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.classList.contains('open')?fecharPal():abrirPal();return}
if(pal.classList.contains('open')){if(e.key==='Escape')fecharPal();else if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(itens.length-1,sel+1);pintar()}else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(0,sel-1);pintar()}else if(e.key==='Enter'){e.preventDefault();exec(sel)}return}
if(e.altKey&&!e.ctrlKey&&!e.metaKey){var m={'1':'tab-painel','2':'tab-novo-checkin','3':'tab-historico','4':'tab-comparison'}[e.key];if(m){e.preventDefault();window.switchTab(m)}}});

var _bk=window.exportarBackupJSON;
if(typeof _bk==='function'&&!_bk.__ef55Wrapped){
    var wrapped=function(){
        try{localStorage.setItem('ef55_last_backup',String(Date.now()))}catch(e){}
        return _bk.apply(this,arguments);
    };
    wrapped.__ef55Wrapped=true;
    window.exportarBackupJSON=wrapped;
}
setTimeout(function(){try{if(!lista().length)return;var t=+localStorage.getItem('ef55_last_backup')||0;
if(Date.now()-t>7*864e5)toast(window.innerWidth<=768 ? 'Faz mais de 7 dias sem backup. Acesse Ferramentas › Backup.' : 'Faz mais de 7 dias sem backup. Use Ctrl+K › Fazer Backup.','warn')}catch(e){}},2500);
})();
