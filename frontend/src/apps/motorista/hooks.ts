import { useAsync } from '@/hooks/useAsync'
import { fetchDriverHome } from './services/driverAppService'

export function useDriverHome() {
  return useAsync(fetchDriverHome)
}
