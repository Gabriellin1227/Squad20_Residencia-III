import type { Driver, DriverInput } from '../types'

/*
 * Persistência local (localStorage) enquanto a integração com a API não é feita.
 * As funções públicas são assíncronas e devolvem os mesmos tipos que a versão real
 * devolverá; para integrar, basta trocar os corpos por chamadas fetch('/driver').
 */

const STORAGE_KEY = 'frotamanager:drivers'

type SeedExtra = Partial<Driver>

function seed(
  name: string,
  cnh: string,
  cnhCategory: Driver['cnhCategory'],
  cnhExpiry: string,
  vehicles: string[],
  status: Driver['status'],
  extra: SeedExtra = {},
): Driver {
  return {
    id: cnh,
    name,
    cpf: '',
    phone: '',
    email: `${(name.split(' ')[0] ?? '').toLowerCase()}@fsph.se.gov.br`,
    cnh,
    cnhCategory,
    cnhExpiry,
    fleet: 'Administrativa',
    vehicles,
    isWildcard: false,
    status,
    createdAt: new Date().toISOString(),
    ...extra,
  }
}

// Dados demonstrativos (as placas existem no vehicleService).
function buildSeed(): Driver[] {
  return [
    seed(
      'João da Silva',
      '01234567890',
      'D',
      '2027-12-31',
      ['ABC-1D23', 'IJK-7L89'],
      'ativo',
      {
        cpf: '529.982.247-25',
        phone: '(79) 99876-5432',
      },
    ),
    seed('Maria Oliveira', '98765432100', 'B', '2026-10-31', ['EFG-4H56'], 'ativo'),
    seed('Carlos Souza', '45678912300', 'E', '2028-08-31', [], 'em_viagem', {
      isWildcard: true,
      fleet: '',
    }),
    seed('Ana Pereira', '32165498700', 'C', '2026-07-31', [], 'bloqueado'),
    seed('Pedro Santos', '74185296300', 'D', '2027-11-30', ['MNO-0P12'], 'ativo'),
    seed('Lucas Almeida', '85296374100', 'B', '2029-03-31', ['QRS-3T45'], 'ferias'),
    seed('Fernanda Lima', '15975348600', 'B', '2028-05-31', ['TUV-6W78'], 'ativo', {
      fleet: 'SVO',
    }),
    seed('Rafael Costa', '75315945600', 'D', '2027-06-30', ['XYZ-9A01'], 'ativo', {
      fleet: 'SVO',
    }),
  ]
}

function readDrivers(): Driver[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Driver[]

    const initial = buildSeed()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  } catch {
    // Armazenamento indisponível ou corrompido: volta aos dados demonstrativos.
    return buildSeed()
  }
}

function writeDrivers(drivers: Driver[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers))
}

function assertUniqueCnh(drivers: Driver[], cnh: string, ignoreId?: string): void {
  if (drivers.some((driver) => driver.cnh === cnh && driver.id !== ignoreId)) {
    throw new Error('Já existe um motorista com essa CNH.')
  }
}

/** GET /driver */
export async function getDrivers(): Promise<Driver[]> {
  return readDrivers()
}

/** GET /driver/:id */
export async function getDriver(id: string): Promise<Driver> {
  const driver = readDrivers().find((item) => item.id === id)
  if (!driver) throw new Error('Motorista não encontrado.')
  return driver
}

/** POST /driver */
export async function createDriver(input: DriverInput): Promise<Driver> {
  const drivers = readDrivers()
  assertUniqueCnh(drivers, input.cnh)

  const driver: Driver = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  writeDrivers([driver, ...drivers])
  return driver
}

/** PUT /driver/:id */
export async function updateDriver(id: string, input: DriverInput): Promise<Driver> {
  const drivers = readDrivers()
  const current = drivers.find((item) => item.id === id)
  if (!current) throw new Error('Motorista não encontrado.')
  assertUniqueCnh(drivers, input.cnh, id)

  const updated: Driver = { ...current, ...input }
  writeDrivers(drivers.map((item) => (item.id === id ? updated : item)))
  return updated
}

/** DELETE /driver/:id */
export async function deleteDriver(id: string): Promise<void> {
  writeDrivers(readDrivers().filter((item) => item.id !== id))
}
