import { ButtonLink } from '@/components/ButtonLink'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Página não encontrada')

  return (
    <>
      <PageHeader title="Página não encontrada" />
      <StateMessage
        title="Esta página não existe ou foi movida."
        action={<ButtonLink to="/">Voltar ao início</ButtonLink>}
      />
    </>
  )
}
