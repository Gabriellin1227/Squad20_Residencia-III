import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'
import type { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'
import buttonStyles from '../Button/Button.module.scss'

export interface ButtonLinkProps extends LinkProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  isFullWidth?: boolean
  iconStart?: ReactNode
}

/** Link de navegação com a mesma aparência do Button. */
export function ButtonLink({
  children,
  variant = 'primary',
  isFullWidth = false,
  iconStart,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={classNames(
        buttonStyles.button,
        buttonStyles[variant],
        isFullWidth && buttonStyles.fullWidth,
        buttonStyles.link,
        className,
      )}
      {...rest}
    >
      {iconStart && (
        <span className={buttonStyles.icon} aria-hidden="true">
          {iconStart}
        </span>
      )}
      {children}
    </Link>
  )
}
