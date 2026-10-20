import { classNames } from '@/utils/classNames'
import styles from './Avatar.module.scss'

export interface AvatarProps {
  name: string
  src?: string | undefined
  size?: 'md' | 'lg'
  className?: string
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''
  return `${first}${last}`.toUpperCase()
}

/** Foto da pessoa ou, na falta dela, as iniciais do nome. */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <span className={classNames(styles.avatar, styles[size], className)}>
      {src ? (
        <img src={src} alt={`Foto de ${name}`} className={styles.image} />
      ) : (
        <span aria-hidden="true">{getInitials(name) || '?'}</span>
      )}
    </span>
  )
}
