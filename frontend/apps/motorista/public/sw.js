/*
 * Service worker do app do motorista — ONLINE-FIRST.
 *
 * O app acompanha a rota em tempo real, então NADA de dados é guardado em cache:
 * requisições à API e aos assets sempre vão para a rede. O SW existe para o app
 * ser instalável e, quando não há internet, mostrar a página /offline.html
 * em vez do erro do navegador.
 */
const OFFLINE_CACHE = 'motorista-offline-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(OFFLINE_CACHE).then((cache) => cache.add(OFFLINE_URL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== OFFLINE_CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  // Só intercepta navegações (abrir/recarregar o app); todo o resto passa direto pela rede.
  if (event.request.mode !== 'navigate') return

  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)))
})
