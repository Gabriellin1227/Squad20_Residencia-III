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
  className?: string
}

export function SelectField<TValue extends string>({
  label,
  value,
  options,
  onChange,
  isLabelHidden = false,
  className,
}: SelectFieldProps<TValue>) {
  const selectId = useId()

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
        className={styles.select}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
