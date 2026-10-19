/* Registro e Gerenciamento do Service Worker & Cache Offline */
(function() {
  if (!('serviceWorker' in navigator) ||
      !(location.protocol === 'https:' || location.protocol === 'http:' ||
        location.hostname === 'localhost' || location.hostname === '127.0.0.1')) return;
  let updating = false;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (updating) location.reload();
  });
  function oferecerAtualizacao(worker) {
    if (!worker || !navigator.serviceWorker.controller ||
        document.getElementById('ef893-update-banner')) return;
    const bar = document.createElement('div');
    bar.id = 'ef893-update-banner';
    bar.setAttribute('role', 'status');
    bar.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;z-index:9999;padding:12px;background:#0f172a;color:#fff;border:1px solid #64748b;border-radius:8px';
    bar.textContent = 'Nova versão disponível. Salve seus dados antes de atualizar. ';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Atualizar agora';
    btn.onclick = function() {
      if (!worker || worker.state === 'redundant') return;
      updating = true;
      worker.postMessage({type:'SKIP_WAITING'});
    };
    bar.appendChild(btn);
    document.body.appendChild(bar);
  }
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js', {scope:'./'})
      .then(function(reg) {
        console.log('[EvoluFísico PWA] Service Worker registrado:', reg.scope);
        if (reg.waiting) oferecerAtualizacao(reg.waiting);
        reg.addEventListener('updatefound', function() {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener('statechange', function() {
            if (worker.state === 'installed') oferecerAtualizacao(reg.waiting || worker);
          });
        });
        reg.update().catch(function(err) {
          console.warn('[EvoluFísico PWA] Não foi possível verificar atualização:', err);
        });
      })
      .catch(function(err) {
        console.warn('[EvoluFísico PWA] Aviso ao registrar Service Worker:', err);
      });
  });
})();