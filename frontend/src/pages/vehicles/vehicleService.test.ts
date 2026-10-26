import { beforeEach, expect, test, vi } from 'vitest'
import { api } from '@/service/api'
import { getVehicleDetails } from './services/vehicleService'

vi.unmock('@/pages/vehicles/services/vehicleService')
vi.mock('@/service/api', () => ({ api: vi.fn<typeof api>() }))
beforeEach(() => vi.resetAllMocks())
const vehicle = {
  id: 'v1',
  placa: 'SVO0A01',
  modelo: 'Demo',
  tipo_combustivel: 'Diesel',
  capacidade_maxima: 60,
  status: 'ativo',
  ativo: true,
}

test('preserva o veículo quando o histórico falha e permite mostrar o erro no card', async () => {
  vi.mocked(api)
    .mockResolvedValueOnce({ message: vehicle })
    .mockRejectedValueOnce(new Error('Servidor indisponível'))
  const details = await getVehicleDetails('v1')
  expect(details.vehicle.plate).toBe('SVO0A01')
  expect(details.tripsError).toBe('Não foi possível carregar o histórico de viagens.')
  expect(details.availability?.trips).toBe(false)
})

test('carrega viagens reais sem inventar data ou trajeto para viagem agendada', async () => {
  vi.mocked(api)
    .mockResolvedValueOnce({ message: vehicle })
    .mockResolvedValueOnce({
      message: [
        {
          id: 'trip-1',
          status: 'Agendada',
          data_inicio: null,
          km_inicial: null,
          km_final: null,
        },
      ],
    })
  const details = await getVehicleDetails('v1')
  expect(details.trips).toEqual([
    {
      id: 'trip-1',
      code: 'trip-1',
      status: 'Agendada',
      startedAt: null,
      mileageStart: null,
      mileageEnd: null,
    },
  ])
  expect(details.tripsError).toBeUndefined()
  expect(api).toHaveBeenNthCalledWith(2, '/vehicles/v1/trips')
})
