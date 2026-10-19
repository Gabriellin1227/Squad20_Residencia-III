import { useCallback } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getVehicleDetails } from '../services/vehicleService';

export function useVehicleDetails(vehicleId: string) {
  const loadDetails = useCallback(() => getVehicleDetails(vehicleId), [vehicleId]);
  return useAsync(loadDetails);
}
