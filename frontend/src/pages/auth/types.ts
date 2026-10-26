export type Status = 'idle' | 'loading' | 'error'

export interface LoginFormValues {
  registration: string
  password: string
}

export interface LoginFormErrors {
  registration?: string
  password?: string
}
