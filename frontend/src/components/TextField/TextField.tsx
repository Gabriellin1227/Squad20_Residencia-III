import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { classNames } from '@/utils/classNames'
import styles from './TextField.module.scss'

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  label: string
  isLabelHidden?: boolean
  isInvalid?: boolean
  errorMessage?: string
  onChange?: (value: string) => void
}

export function TextField({
  label,
  isLabelHidden = false,
  isInvalid = false,
  errorMessage,
  onChange,
  className,
  id,
  ...rest
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={classNames(styles.field, className)}>
      <label
        htmlFor={inputId}
        className={classNames(styles.label, isLabelHidden && styles.labelHidden)}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={classNames(styles.input, isInvalid && styles.inputInvalid)}
        aria-invalid={isInvalid}
        aria-errormessage={errorMessage ? `${inputId}-error` : undefined}
        onChange={(event) => onChange?.(event.target.value)}
        {...rest}
      />
      {errorMessage ? (
        <span id={`${inputId}-error`} className={styles.errorMessage} role="alert">
          {errorMessage}
        </span>
      ) : null}
    </div>
  )
}
