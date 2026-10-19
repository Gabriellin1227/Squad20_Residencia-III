import type { ReactNode } from 'react';
import { classNames } from '@/utils/classNames';
import styles from './StateMessage.module.scss';

export interface StateMessageProps {
  title: string;
  description?: string;
  variant?: 'loading' | 'empty' | 'error';
  action?: ReactNode;
  className?: string;
}

export function StateMessage({ title, description, variant = 'empty', action, className }: StateMessageProps) {
  return (
    <div
      className={classNames(styles.state, styles[variant], className)}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {variant === 'loading' && <span className={styles.spinner} aria-hidden="true" />}
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  );
}
