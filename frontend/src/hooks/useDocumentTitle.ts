import { useEffect } from 'react'

const APP_NAME = 'FrotaManager FSPH'

/** Atualiza o título da aba: "Motoristas — FrotaManager FSPH". */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} — ${APP_NAME}`
  }, [title])
}
