/* Kárita Teodoro — funciona como aplicativo e abre mesmo com internet fraca.
   Desenvolvido por Wendel Emílio de Souza Matias — oficial.respostas@gmail.com */
const CACHE = 'kt-app-v2.7';
const ARQUIVOS = ['./', 'index.html', 'relatorio-atendimento.html', 'site.webmanifest', 'painel.webmanifest',
  'icones/icon-192.png', 'icones/icon-512.png', 'icones/icon-maskable-512.png', 'icones/apple-touch-icon.png', 'icones/favicon-64.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; /* nuvem e WhatsApp sempre direto */
  /* páginas: tenta a versão nova primeiro; sem internet, usa a guardada */
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return res; })));
});
