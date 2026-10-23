/** Registra o service worker só em produção (em dev ele atrapalharia o HMR). */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Sem SW o app continua funcionando online; só não fica instalável.
    })
  })
}
