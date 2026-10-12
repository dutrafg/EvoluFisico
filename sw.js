/* ==========================================================================
   EvoluFísico v8.9 Estável — Service Worker & Offline Cache Storage
   Estratégia: Network-First com Fallback Automático para Cache Offline
   ========================================================================== */

const CACHE_NAME = 'evolufisico-v8.9-cache-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './evolufisico.html',
  './manifest.webmanifest'
];

// Instalação do Service Worker: baixa e pré-armazena os arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[SW v8.9] Aviso ao adicionar arquivos ao precache:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker: limpa caches antigos de versões anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW v8.9] Removendo cache obsoleto:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições: Network-First com fallback para cache
self.addEventListener('fetch', (event) => {
  // Apenas métodos GET são cacheados
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Ignorar esquemas que não sejam http/https (como chrome-extension:// ou data:)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se a resposta for válida, clonar e atualizar no cache em segundo plano
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Falha de rede (offline): buscar do cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se for uma requisição de página/navegação, entregar o index.html em cache
        if (event.request.mode === 'navigate') {
          const fallbackPage = await caches.match('./index.html') || await caches.match('./evolufisico.html') || await caches.match('./');
          if (fallbackPage) {
            return fallbackPage;
          }
        }

        return new Response('Aplicativo offline. Carregue o EvoluFísico a partir do cache.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      })
  );
});
