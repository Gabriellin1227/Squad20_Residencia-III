import type {
  Fleet,
  InspectionItem,
  Maintenance,
  Trip,
  Vehicle,
  VehicleDetails,
  VehicleExtraInfoResponse,
  VehicleResponse,
  VehicleStatus,
} from '../types'

/*
 * Dados mockados enquanto a integração com a API não é feita.
 * As funções públicas são assíncronas e devolvem os mesmos tipos que a versão real
 * devolverá; para integrar, basta trocar os corpos por chamadas fetch('/vehicle').
 */

const MOCK_DELAY_MS = 400

function respondWith<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY_MS))
}

function mockId(index: number): string {
  return `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`
}

type MockRow = [
  identificacao: string,
  modelo: string,
  placa: string,
  quilometragem: number,
  status: string,
  ativo: boolean,
  frota: Fleet,
  tipoCombustivel: string,
  capacidadeMaxima: number,
  proximaVistoria: string,
]

// Os 6 primeiros reproduzem o protótipo do Figma.
const MOCK_ROWS: MockRow[] = [
  [
    'SVO-01',
    'Fiat Fiorino',
    'ABC-1D23',
    45320,
    'Disponível',
    true,
    'Administrativa',
    'Flex',
    2,
    '2027-01',
  ],
  [
    'SVO-02',
    'Renault Master',
    'EFG-4H56',
    30150,
    'Em manutenção',
    true,
    'Assistencial',
    'Diesel',
    16,
    '2026-12',
  ],
  [
    'SVO-03',
    'Chevrolet Spin',
    'IJK-7L89',
    88905,
    'Em viagem',
    true,
    'Assistencial',
    'Flex',
    7,
    '2026-11',
  ],
  [
    'SVO-04',
    'Volkswagen Saveiro',
    'MNO-0P12',
    15402,
    'Disponível',
    false,
    'Operacional',
    'Flex',
    2,
    '2027-03',
  ],
  [
    'SVO-05',
    'Fiat Ducato',
    'QRS-3T45',
    59700,
    'Disponível',
    true,
    'Assistencial',
    'Diesel',
    16,
    '2027-02',
  ],
  [
    'SVO-06',
    'Toyota Corolla',
    'KLM-8N21',
    42110,
    'Em manutenção',
    true,
    'Administrativa',
    'Flex',
    5,
    '2026-12',
  ],
  [
    'SVO-07',
    'Renault Kangoo',
    'TUV-6W78',
    67230,
    'Em viagem',
    true,
    'Operacional',
    'Flex',
    2,
    '2027-04',
  ],
  [
    'SVO-08',
    'Fiat Strada',
    'XYZ-9A01',
    21870,
    'Disponível',
    true,
    'Operacional',
    'Flex',
    2,
    '2027-05',
  ],
  [
    'SVO-09',
    'Mercedes-Benz Sprinter',
    'BCD-2E34',
    112450,
    'Disponível',
    true,
    'Assistencial',
    'Diesel',
    16,
    '2026-11',
  ],
  [
    'SVO-10',
    'Chevrolet S10',
    'FGH-5I67',
    98320,
    'Em manutenção',
    true,
    'Operacional',
    'Diesel',
    5,
    '2027-01',
  ],
  [
    'SVO-11',
    'Volkswagen Gol',
    'JKL-8M90',
    75400,
    'Disponível',
    false,
    'Administrativa',
    'Flex',
    5,
    '2027-02',
  ],
  [
    'SVO-12',
    'Peugeot Partner',
    'NOP-1Q23',
    33980,
    'Em viagem',
    true,
    'Assistencial',
    'Flex',
    2,
    '2027-06',
  ],
  [
    'SVO-13',
    'Toyota Hilux',
    'RST-4U56',
    54210,
    'Disponível',
    true,
    'Operacional',
    'Diesel',
    5,
    '2027-03',
  ],
  [
    'SVO-14',
    'Fiat Doblò',
    'VWX-7Y89',
    81760,
    'Disponível',
    true,
    'Assistencial',
    'Flex',
    7,
    '2026-12',
  ],
  [
    'SVO-15',
    'Renault Duster',
    'ZAB-0C12',
    27640,
    'Em viagem',
    true,
    'Administrativa',
    'Flex',
    5,
    '2027-04',
  ],
  [
    'SVO-16',
    'Iveco Daily',
    'DEF-3G45',
    143900,
    'Em manutenção',
    true,
    'Assistencial',
    'Diesel',
    16,
    '2026-11',
  ],
  [
    'SVO-17',
    'Hyundai HB20',
    'HIJ-6K78',
    18350,
    'Disponível',
    true,
    'Administrativa',
    'Flex',
    5,
    '2027-07',
  ],
  [
    'SVO-18',
    'Citroën Jumper',
    'LMN-9O01',
    96120,
    'Disponível',
    false,
    'Assistencial',
    'Diesel',
    15,
    '2027-01',
  ],
  [
    'SVO-19',
    'Nissan Frontier',
    'PQR-2S34',
    61480,
    'Em viagem',
    true,
    'Operacional',
    'Diesel',
    5,
    '2027-02',
  ],
  [
    'SVO-20',
    'Volkswagen Amarok',
    'TUV-5W67',
    70230,
    'Disponível',
    true,
    'Operacional',
    'Diesel',
    5,
    '2027-05',
  ],
  [
    'SVO-21',
    'Fiat Cronos',
    'XYZ-8A90',
    12900,
    'Disponível',
    true,
    'Administrativa',
    'Flex',
    5,
    '2027-08',
  ],
  [
    'SVO-22',
    'Ford Transit',
    'BCD-1E23',
    88770,
    'Em manutenção',
    true,
    'Assistencial',
    'Diesel',
    16,
    '2026-12',
  ],
  [
    'SVO-23',
    'Chevrolet Onix',
    'FGH-4I56',
    24560,
    'Disponível',
    true,
    'Administrativa',
    'Flex',
    5,
    '2027-06',
  ],
  [
    'SVO-24',
    'Renault Master',
    'JKL-7M89',
    105300,
    'Em viagem',
    true,
    'Assistencial',
    'Diesel',
    16,
    '2027-03',
  ],
]

/** Mock de GET /vehicle */
const VEHICLES_RESPONSE: VehicleResponse[] = MOCK_ROWS.map((row, index) => ({
  id: mockId(index + 1),
  placa: row[2],
  modelo: row[1],
  tipo_combustivel: row[7],
  capacidade_maxima: row[8],
  status: row[4],
  ativo: row[5],
}))

const VEHICLES_EXTRA_INFO: Record<string, VehicleExtraInfoResponse> = Object.fromEntries(
  MOCK_ROWS.map((row, index) => [
    mockId(index + 1),
    {
      identificacao: row[0],
      quilometragem: row[3],
      frota: row[6],
      proxima_vistoria: row[9],
    },
  ]),
)

function todayAt(hours: number, minutes: number): string {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

const TRIPS_BY_VEHICLE: Record<string, Trip[]> = {
  [mockId(1)]: [
    {
      id: 'v-1842',
      code: 'V-1842',
      origin: 'Central SVO',
      destination: 'Posto Sul',
      startedAt: todayAt(10, 30),
    },
    {
      id: 'v-1839',
      code: 'V-1839',
      origin: 'Base SVO',
      destination: 'Terminal Norte',
      startedAt: '2026-09-27T14:20:00',
    },
    {
      id: 'v-1828',
      code: 'V-1828',
      origin: 'Hospital',
      destination: 'Central SVO',
      startedAt: '2026-09-25T09:10:00',
    },
  ],
}

const MAINTENANCES_BY_VEHICLE: Record<string, Maintenance[]> = {
  [mockId(1)]: [
    {
      id: 'm-1',
      type: 'preventiva',
      description: 'Troca de óleo e filtros',
      date: '2026-09-10',
      mileageKm: 40000,
      cost: 450,
    },
  ],
}

const CHECKLIST_LABELS = ['Pneus e rodas', 'Freios', 'Iluminação', 'Documentação']

function buildChecklist(status: VehicleStatus): InspectionItem[] {
  return CHECKLIST_LABELS.map((label, index) => ({
    id: `item-${index + 1}`,
    label,
    // Veículos em manutenção ficam com os freios pendentes no mock.
    isOk: !(status === 'manutencao' && label === 'Freios'),
  }))
}

function toVehicleStatus(status: string, isActive: boolean): VehicleStatus {
  if (!isActive) return 'inativo'
  if (status === 'Em manutenção') return 'manutencao'
  if (status === 'Em viagem') return 'em_viagem'
  return 'ativo'
}

function toVehicle(response: VehicleResponse): Vehicle {
  const extra = VEHICLES_EXTRA_INFO[response.id]

  return {
    id: response.id,
    identification: extra?.identificacao ?? '—',
    plate: response.placa,
    model: response.modelo,
    fuelType: response.tipo_combustivel,
    maxCapacity: response.capacidade_maxima,
    status: toVehicleStatus(response.status, response.ativo),
    mileageKm: extra?.quilometragem ?? 0,
    fleet: extra?.frota ?? 'Administrativa',
    nextInspection: extra?.proxima_vistoria ?? '',
  }
}

/** GET /vehicle */
export async function getVehicles(): Promise<Vehicle[]> {
  const response = await respondWith(VEHICLES_RESPONSE)
  return response.map(toVehicle)
}

/** GET /vehicle/:id + viagens, manutenções e vistoria (ainda mockados). */
export async function getVehicleDetails(id: string): Promise<VehicleDetails> {
  const response = await respondWith(
    VEHICLES_RESPONSE.find((vehicle) => vehicle.id === id),
  )
  if (!response) throw new Error('Veículo não encontrado.')

  const vehicle = toVehicle(response)
  return {
    vehicle,
    trips: TRIPS_BY_VEHICLE[id] ?? [],
    maintenances: MAINTENANCES_BY_VEHICLE[id] ?? [],
    checklist: buildChecklist(vehicle.status),
  }
}
