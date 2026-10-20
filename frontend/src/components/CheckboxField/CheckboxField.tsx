import { useId } from 'react'
import { classNames } from '@/utils/classNames'
import styles from './CheckboxField.module.scss'

export interface CheckboxFieldProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
  className?: string
}

export function CheckboxField({
  label,
  description,
  checked,
  onChange,
  id,
  className,
}: CheckboxFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label htmlFor={inputId} className={classNames(styles.field, className)}>
      <input
        id={inputId}
        type="checkbox"
        className={styles.input}
        checked={checked}
        aria-describedby={description ? `${inputId}-description` : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description && (
          <span id={`${inputId}-description`} className={styles.description}>
            {description}
          </span>
        )}
      </span>
    </label>
  )
}
