import { useAsync } from '@/hooks/useAsync'
import { getDrivers } from '../services/driverService'

export function useDrivers() {
  return useAsync(getDrivers)
}
