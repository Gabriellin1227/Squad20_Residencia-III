import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '@/utils/classNames';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  isFullWidth?: boolean;
  isLoading?: boolean;
  iconStart?: ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  isFullWidth = false,
  isLoading = false,
  iconStart,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(styles.button, styles[variant], isFullWidth && styles.fullWidth, className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {iconStart && (
        <span className={styles.icon} aria-hidden="true">
          {iconStart}
        </span>
      )}
      {children}
    </button>
  );
}
