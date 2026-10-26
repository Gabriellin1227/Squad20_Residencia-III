import { MemoryRouter } from 'react-router-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { VehicleDetailsPage } from './VehicleDetailsPage'
import { getVehicleDetails } from './services/vehicleService'

vi.mock('./services/vehicleService', () => ({
  getVehicleDetails: vi.fn<typeof getVehicleDetails>(),
}))

test('exibe card de vistoria indisponível e abre/fecha o histórico sem inventar viagens', async () => {
  vi.mocked(getVehicleDetails).mockResolvedValue({
    vehicle: {
      id: 'v1',
      plate: 'SVO0A01',
      model: 'SVO demo',
      fuelType: 'Diesel',
      maxCapacity: 60,
      mileageKm: 0,
      status: 'ativo',
      fleet: 'SVO',
      identification: '',
      nextInspection: '',
    },
    trips: [],
    maintenances: [],
    checklist: [],
    availability: { trips: true, checklist: false, maintenance: false },
  })
  const user = userEvent.setup()
  render(<VehicleDetailsPage vehicleId="v1" onBack={vi.fn<() => void>()} />, {
    wrapper: MemoryRouter,
  })
  expect(
    await screen.findByRole('heading', { name: 'Checklist de Vistorias' }),
  ).toBeInTheDocument()
  expect(
    screen.getByText('O registro de vistorias ainda não está integrado à API.'),
  ).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Ver histórico completo' }))
  const dialog = screen.getByRole('dialog', { name: 'Histórico de viagens' })
  expect(
    within(dialog).getByText('Nenhuma viagem registrada para este veículo.'),
  ).toBeInTheDocument()
  await user.click(within(dialog).getByRole('button', { name: 'Fechar' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
