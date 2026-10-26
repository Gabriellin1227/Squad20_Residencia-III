import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { VehicleForm } from './VehicleForm'
import { api } from '@/service/api'

vi.mock('@/service/api', () => ({ api: vi.fn<typeof api>() }))

test('cadastra veículo com valores numéricos e prévia da placa', async () => {
  const user = userEvent.setup()
  vi.mocked(api).mockResolvedValueOnce({})
  const onSave = vi.fn<() => void>()
  render(<VehicleForm vehicle={null} onSave={onSave} onCancel={vi.fn<() => void>()} />)
  await user.type(screen.getByLabelText('Placa'), 'abc1d23')
  await user.type(screen.getByLabelText('Modelo'), 'Fiat Fiorino')
  await user.type(screen.getByLabelText('Combustível'), 'Flex')
  await user.type(screen.getByLabelText('Capacidade máxima'), '58')
  expect(screen.getByText('ABC1D23')).toBeInTheDocument()
  expect(
    screen.queryByLabelText('Quilometragem do último alerta'),
  ).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Cadastrar veículo' }))
  expect(api).toHaveBeenCalledWith(
    '/vehicles',
    expect.objectContaining({
      method: 'POST',
      body: expect.any(String),
    }),
  )
  const options = vi.mocked(api).mock.calls[vi.mocked(api).mock.calls.length - 1]?.[1]
  expect(JSON.parse(options?.body as string)).toMatchObject({
    placa: 'ABC1D23',
    capacidade_maxima: 58,
    quilometragem: 0,
    ultimo_km_alertado: 0,
  })
  expect(onSave).toHaveBeenCalledOnce()
})

test('mantém os dados preenchidos quando a API recusa o cadastro', async () => {
  const user = userEvent.setup()
  vi.mocked(api).mockRejectedValueOnce(new Error('Placa já cadastrada.'))
  render(
    <VehicleForm
      vehicle={null}
      onSave={vi.fn<() => void>()}
      onCancel={vi.fn<() => void>()}
    />,
  )
  await user.type(screen.getByLabelText('Placa'), 'abc1d23')
  await user.type(screen.getByLabelText('Modelo'), 'Fiat Fiorino')
  await user.type(screen.getByLabelText('Combustível'), 'Flex')
  await user.type(screen.getByLabelText('Capacidade máxima'), '58')
  await user.click(screen.getByRole('button', { name: 'Cadastrar veículo' }))
  expect(await screen.findByText('Placa já cadastrada.')).toBeInTheDocument()
  expect(screen.getByLabelText('Placa')).toHaveValue('ABC1D23')
})

test('reaproveita o formulário e envia PUT ao editar', async () => {
  const user = userEvent.setup()
  vi.mocked(api).mockResolvedValueOnce({})
  render(
    <VehicleForm
      vehicle={{
        id: 'vehicle-1',
        identification: '',
        plate: 'ABC1D23',
        model: 'Fiorino',
        fuelType: 'Flex',
        maxCapacity: 58,
        mileageKm: 1200,
        lastAlertedKm: 1000,
        monthlyCap: 1500,
        status: 'ativo',
        fleet: 'Não informada',
        nextInspection: '',
      }}
      onSave={vi.fn<() => void>()}
      onCancel={vi.fn<() => void>()}
    />,
  )
  expect(screen.getByLabelText('Modelo')).toHaveValue('Fiorino')
  await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))
  const options = vi.mocked(api).mock.calls[vi.mocked(api).mock.calls.length - 1]?.[1]
  expect(JSON.parse(options?.body as string).ultimo_km_alertado).toBe(1000)
  expect(api).toHaveBeenLastCalledWith(
    '/vehicles/vehicle-1',
    expect.objectContaining({ method: 'PUT' }),
  )
})
