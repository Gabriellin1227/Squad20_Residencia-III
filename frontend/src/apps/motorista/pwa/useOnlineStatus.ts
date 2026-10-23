import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void): () => void {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

/** `false` quando o aparelho perde a conexão (o app depende de internet). */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  )
}
