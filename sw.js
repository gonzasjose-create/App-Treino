// Service worker: guarda os ficheiros da app para funcionar offline.
// Os DADOS não passam por aqui (estão no IndexedDB). Ao publicar uma nova versão, incrementa VERSAO.
const VERSAO = 'treino-v1';
const FICHEIROS = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css',
  'vendor/sql-wasm.js', 'vendor/sql-wasm.wasm',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/app.js', 'js/db.js', 'js/schema.js', 'js/repo.js', 'js/calc.js', 'js/catalogos.js', 'js/util.js', 'js/seed.js',
  'js/views/ui.js', 'js/views/painel.js', 'js/views/clientes.js', 'js/views/cliente.js', 'js/views/cliente-form.js',
  'js/views/avaliacao.js', 'js/views/avaliacao-form.js', 'js/views/definicoes.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(FICHEIROS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache primeiro (rápido e offline no ginásio); a versão nova entra quando VERSAO muda.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request)));
});
