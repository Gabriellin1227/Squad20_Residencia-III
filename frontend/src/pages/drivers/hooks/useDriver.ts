import { useCallback } from 'react'
import { useAsync } from '@/hooks/useAsync'
import type { Driver } from '../types'
import { getDriver } from '../services/driverService'

/** Carrega um motorista; sem `id` (tela de cadastro) resolve `undefined`. */
export function useDriver(id: string | undefined) {
  const loadDriver = useCallback(
    (): Promise<Driver | undefined> => (id ? getDriver(id) : Promise.resolve(undefined)),
    [id],
  )
  return useAsync(loadDriver)
}
