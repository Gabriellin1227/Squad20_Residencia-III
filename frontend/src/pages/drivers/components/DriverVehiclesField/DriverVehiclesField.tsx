import { useState } from 'react'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { SelectField } from '@/components/SelectField'
import type { SelectOption } from '@/components/SelectField'
import styles from './DriverVehiclesField.module.scss'

export interface DriverVehiclesFieldProps {
  /** Placas já vinculadas. */
  value: string[]
  /** Placas que podem ser vinculadas. */
  options: string[]
  onChange: (plates: string[]) => void
}

export function DriverVehiclesField({
  value,
  options,
  onChange,
}: DriverVehiclesFieldProps) {
  const [selected, setSelected] = useState('')

  const selectOptions: SelectOption<string>[] = [
    { value: '', label: 'Selecione um veículo' },
    ...options
      .filter((plate) => !value.includes(plate))
      .map((plate) => ({ value: plate, label: plate })),
  ]

  function handleAdd() {
    if (!selected || value.includes(selected)) return
    onChange([...value, selected])
    setSelected('')
  }

  return (
    <div className={styles.field}>
      <p className={styles.label} id="driver-vehicles-label">
        Veículo(s) vinculado(s)
      </p>

      {value.length > 0 && (
        <ul className={styles.chips} aria-labelledby="driver-vehicles-label">
          {value.map((plate) => (
            <li key={plate}>
              <Badge variant="info" className={styles.chip}>
                {plate}
                <button
                  type="button"
                  className={styles.remove}
                  aria-label={`Remover ${plate}`}
                  onClick={() => onChange(value.filter((item) => item !== plate))}
                >
                  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.picker}>
        <SelectField
          label="Escolher veículo"
          isLabelHidden
          value={selected}
          options={selectOptions}
          onChange={setSelected}
          className={styles.select}
        />
        <Button variant="secondary" onClick={handleAdd} disabled={!selected}>
          Adicionar
        </Button>
      </div>
    </div>
  )
}
