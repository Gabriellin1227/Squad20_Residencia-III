import { useState, type FormEvent } from 'react'
import type { LoginFormErrors, LoginFormValues, Status } from '../types'

const REQUIRED_REGISTRATION = 'Informe o e-mail.'
const REQUIRED_PASSWORD = 'Informe a senha.'

export interface UseLoginFormResult {
  values: LoginFormValues
  errors: LoginFormErrors
  status: Status
  isLoading: boolean
  handleChange: (value: string, field: keyof LoginFormValues) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

function validate(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (values.registration.trim() === '') {
    errors.registration = REQUIRED_REGISTRATION
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.registration.trim())) {
    errors.registration = 'Informe um e-mail válido.'
  }

  if (values.password.trim() === '') {
    errors.password = REQUIRED_PASSWORD
  }

  return errors
}

export function useLoginForm(
  onSubmit: (values: LoginFormValues) => Promise<void>,
): UseLoginFormResult {
  const [values, setValues] = useState<LoginFormValues>({
    registration: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  const handleChange = (value: string, field: keyof LoginFormValues) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    if (status === 'error') {
      setStatus('idle')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(values)

    if (nextErrors.registration || nextErrors.password) {
      setErrors(nextErrors)
      setStatus('error')
      return
    }

    setStatus('loading')
    try {
      await onSubmit(values)
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  return {
    values,
    errors,
    status,
    isLoading: status === 'loading',
    handleChange,
    handleSubmit,
  }
}
