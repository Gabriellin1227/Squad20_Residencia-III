import { useId } from 'react'
import { classNames } from '@/utils/classNames'
import styles from './SelectField.module.scss'

export interface SelectOption<TValue extends string> {
  value: TValue
  label: string
}

export interface SelectFieldProps<TValue extends string> {
  label: string
  value: TValue
  options: SelectOption<TValue>[]
  onChange: (value: TValue) => void
  isLabelHidden?: boolean
  errorMessage?: string
  id?: string
  className?: string
}

export function SelectField<TValue extends string>({
  label,
  value,
  options,
  onChange,
  isLabelHidden = false,
  errorMessage,
  id,
  className,
}: SelectFieldProps<TValue>) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  function handleChange(nextValue: string) {
    const option = options.find((item) => item.value === nextValue)
    if (option) onChange(option.value)
  }

  return (
    <div className={classNames(styles.field, className)}>
      <label
        htmlFor={selectId}
        className={classNames(styles.label, isLabelHidden && styles.labelHidden)}
      >
        {label}
      </label>
      <select
        id={selectId}
        className={classNames(styles.select, errorMessage && styles.selectInvalid)}
        value={value}
        aria-invalid={errorMessage ? true : undefined}
        aria-errormessage={errorMessage ? `${selectId}-error` : undefined}
        onChange={(event) => handleChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage ? (
        <span id={`${selectId}-error`} className={styles.errorMessage} role="alert">
          {errorMessage}
        </span>
      ) : null}
    </div>
  )
}
