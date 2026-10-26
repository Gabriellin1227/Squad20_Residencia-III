import { Badge } from '@/components/Badge'
import { formatDate, formatMonthYear } from '@/utils/format'
import { getCnhSituation } from '../../utils/driverRules'

export interface CnhExpiryProps {
  /** Validade da CNH em "AAAA-MM-DD". */
  expiry: string
  /** "month" → "Dez/2027" (tabela); "date" → "31/12/2027" (detalhes). */
  format?: 'month' | 'date'
}

/** Validade da CNH; destaca em badge quando está vencida ou perto de vencer. */
export function CnhExpiry({ expiry, format = 'month' }: CnhExpiryProps) {
  const text =
    format === 'date' ? formatDate(expiry) : formatMonthYear(expiry.slice(0, 7))
  const situation = getCnhSituation(expiry)

  if (situation === 'expired') return <Badge variant="danger">Vencida {text}</Badge>
  if (situation === 'expiring') return <Badge variant="warning">Vence {text}</Badge>
  return <span>{text}</span>
}
