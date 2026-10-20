import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export interface ComingSoonPageProps {
  title: string
  subtitle?: string
}

/** Tela provisória dos módulos que ainda não foram implementados. */
export function ComingSoonPage({ title, subtitle }: ComingSoonPageProps) {
  useDocumentTitle(title)

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <StateMessage
        title="Módulo em construção."
        description="Esta área estará disponível em breve."
      />
    </>
  )
}
