import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { CheckboxField } from '@/components/CheckboxField'
import { SelectField } from '@/components/SelectField'
import type { SelectOption } from '@/components/SelectField'
import { TextField } from '@/components/TextField'
import { maskCpf, maskDate, onlyDigits } from '@/utils/masks'
import { CNH_CATEGORIES } from '../../types'
import type { CnhCategory, Driver, DriverInput } from '../../types'
import { DRIVER_FIELD_ID_PREFIX, useDriverForm } from '../../hooks/useDriverForm'
import styles from './DriverForm.module.scss'

const CATEGORY_OPTIONS: SelectOption<CnhCategory | ''>[] = [
  { value: '', label: 'Selecione' },
  ...CNH_CATEGORIES.map((category) => ({ value: category, label: category })),
]

const fieldId = (field: string) => `${DRIVER_FIELD_ID_PREFIX}${field}`

export interface DriverFormProps {
  /** Motorista em edição; sem ele o formulário é de cadastro. */
  initial?: Driver | undefined
  onSubmit: (input: DriverInput) => Promise<void>
  onCancel: () => void
}

export function DriverForm({ initial, onSubmit, onCancel }: DriverFormProps) {
  const form = useDriverForm(initial, onSubmit)
  const { values, errors, setField } = form

  return (
    <form onSubmit={form.handleSubmit} noValidate className={styles.form}>
      <Card>
        <Alert variant="info">
          Os dados serão validados antes de salvar o cadastro. Campos com * são
          obrigatórios.
        </Alert>

        {(form.hasErrors || form.submitError) && (
          <Alert variant="danger">
            {form.submitError ?? 'Corrija os campos destacados.'}
          </Alert>
        )}

        <div className={styles.layout}>
          <div className={styles.sections}>
            <fieldset className={styles.section}>
              <legend className={styles.legend}>Dados pessoais</legend>
              <div className={styles.grid2}>
                <TextField
                  id={fieldId('name')}
                  label="Nome completo *"
                  placeholder="Ex.: João da Silva"
                  value={values.name}
                  onChange={(value) => setField('name', value)}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                />
                <TextField
                  id={fieldId('cpf')}
                  label="CPF *"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={values.cpf}
                  onChange={(value) => setField('cpf', maskCpf(value))}
                  isInvalid={!!errors.cpf}
                  errorMessage={errors.cpf}
                />
              </div>
            </fieldset>

            <fieldset className={styles.section}>
              <legend className={styles.legend}>Habilitação (CNH)</legend>
              <div className={styles.grid3}>
                <TextField
                  id={fieldId('cnh')}
                  label="Nº da CNH *"
                  inputMode="numeric"
                  placeholder="00000000000"
                  value={values.cnh}
                  onChange={(value) => setField('cnh', onlyDigits(value).slice(0, 11))}
                  isInvalid={!!errors.cnh}
                  errorMessage={errors.cnh}
                />
                <SelectField
                  id={fieldId('cnhCategory')}
                  label="Categoria *"
                  value={values.cnhCategory}
                  options={CATEGORY_OPTIONS}
                  onChange={(value) => setField('cnhCategory', value)}
                  errorMessage={errors.cnhCategory}
                />
                <TextField
                  id={fieldId('cnhExpiry')}
                  label="Validade *"
                  inputMode="numeric"
                  placeholder="dd/mm/aaaa"
                  value={values.cnhExpiry}
                  onChange={(value) => setField('cnhExpiry', maskDate(value))}
                  isInvalid={!!errors.cnhExpiry}
                  errorMessage={errors.cnhExpiry}
                />
              </div>
              <Alert variant="danger">
                CNH vencida bloqueia o motorista automaticamente para novas viagens. A
                validade deve ser posterior à data de hoje.
              </Alert>
            </fieldset>

            <fieldset className={styles.section}>
              <legend className={styles.legend}>Vínculo com a frota</legend>
              <CheckboxField
                label="Motorista coringa"
                description="Indica que o motorista pode atuar em diferentes frotas."
                checked={values.isWildcard}
                onChange={(checked) => setField('isWildcard', checked)}
              />
            </fieldset>

            <div className={styles.footer}>
              <div className={styles.actions}>
                <Button variant="secondary" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={form.isSubmitting}>
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </form>
  )
}
