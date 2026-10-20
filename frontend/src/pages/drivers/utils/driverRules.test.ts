import { describe, expect, test } from 'vitest'
import type { Driver, DriverFormValues } from '../types'
import {
  canTakeNewTrips,
  getCnhSituation,
  getEffectiveStatus,
  isValidCpf,
  summarizeDrivers,
  validateDriverForm,
} from './driverRules'

const TODAY = new Date(2026, 9, 20) // 20/10/2026

function makeDriver(overrides: Partial<Driver> = {}): Driver {
  return {
    id: '1',
    name: 'João da Silva',
    cpf: '529.982.247-25',
    phone: '(79) 99876-5432',
    email: 'joao@fsph.se.gov.br',
    cnh: '01234567890',
    cnhCategory: 'D',
    cnhExpiry: '2027-12-31',
    fleet: 'Administrativa',
    vehicles: [],
    isWildcard: false,
    status: 'ativo',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const VALID_FORM: DriverFormValues = {
  name: 'João da Silva',
  cpf: '529.982.247-25',
  phone: '(79) 99876-5432',
  email: 'joao@fsph.se.gov.br',
  photo: undefined,
  cnh: '01234567890',
  cnhCategory: 'D',
  cnhExpiry: '31/12/2027',
  fleet: 'Administrativa',
  vehicles: [],
  isWildcard: false,
  status: 'ativo',
}

describe('situação da CNH', () => {
  test('classifica em válida, a vencer (30 dias) e vencida', () => {
    expect(getCnhSituation('2027-12-31', TODAY)).toBe('valid')
    expect(getCnhSituation('2026-11-19', TODAY)).toBe('expiring') // 30 dias
    expect(getCnhSituation('2026-11-20', TODAY)).toBe('valid') // 31 dias
    expect(getCnhSituation('2026-10-20', TODAY)).toBe('expiring') // vence hoje
    expect(getCnhSituation('2026-10-19', TODAY)).toBe('expired')
  })

  test('CNH vencida bloqueia mesmo com status ativo', () => {
    const driver = makeDriver({ cnhExpiry: '2026-07-31', status: 'ativo' })

    expect(getEffectiveStatus(driver, TODAY)).toBe('bloqueado')
    expect(canTakeNewTrips(driver, TODAY)).toBe(false)
  })

  test('só motorista ativo com CNH em dia pode fazer novas viagens', () => {
    expect(canTakeNewTrips(makeDriver(), TODAY)).toBe(true)
    expect(canTakeNewTrips(makeDriver({ status: 'ferias' }), TODAY)).toBe(false)
  })
})

test('summarizeDrivers conta ativos, alertas e bloqueios', () => {
  const summary = summarizeDrivers(
    [
      makeDriver({ id: '1' }),
      makeDriver({ id: '2', cnhExpiry: '2026-10-31' }),
      makeDriver({ id: '3', cnhExpiry: '2026-07-31' }),
      makeDriver({ id: '4', status: 'bloqueado' }),
    ],
    TODAY,
  )

  expect(summary).toEqual({ total: 4, active: 2, expiring: 1, expired: 1, blocked: 2 })
})

describe('validação do formulário', () => {
  test('aceita um cadastro completo', () => {
    expect(validateDriverForm(VALID_FORM, TODAY)).toEqual({})
  })

  test('valida CPF pelos dígitos verificadores', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true)
    expect(isValidCpf('529.982.247-26')).toBe(false)
    expect(isValidCpf('111.111.111-11')).toBe(false)
  })

  test('aponta os campos obrigatórios vazios', () => {
    const errors = validateDriverForm(
      {
        ...VALID_FORM,
        name: 'João',
        cpf: '',
        phone: '123',
        email: 'x',
        cnh: '1',
        cnhCategory: '',
        cnhExpiry: '',
        fleet: '',
      },
      TODAY,
    )

    expect(Object.keys(errors).sort()).toEqual(
      [
        'cnh',
        'cnhCategory',
        'cnhExpiry',
        'cpf',
        'email',
        'fleet',
        'name',
        'phone',
      ].sort(),
    )
  })

  test('CNH vencida só é aceita com o motorista bloqueado', () => {
    const expired = { ...VALID_FORM, cnhExpiry: '01/01/2026' }

    expect(validateDriverForm(expired, TODAY).cnhExpiry).toMatch(/CNH vencida/)
    expect(validateDriverForm({ ...expired, status: 'bloqueado' }, TODAY)).toEqual({})
  })

  test('motorista coringa dispensa a frota', () => {
    expect(
      validateDriverForm({ ...VALID_FORM, fleet: '', isWildcard: true }, TODAY),
    ).toEqual({})
  })
})
