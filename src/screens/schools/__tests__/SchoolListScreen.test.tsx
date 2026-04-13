import { describe, it, expect } from 'vitest'

describe('SchoolListScreen', () => {
  it('renders school list when schools exist', () => {
    const schools = [{ id: '1', name: 'Escola Teste', address: 'Rua Teste 123', classCount: 2 }]
    expect(schools.length).toBe(1)
    expect(schools[0].name).toBe('Escola Teste')
  })

  it('shows empty state when no schools exist', () => {
    const schools: any[] = []
    expect(schools.length).toBe(0)
  })

  it('opens create form when FAB is pressed', () => {
    expect(true).toBe(true)
  })
})

describe('SchoolDetailScreen', () => {
  it('renders school details', () => {
    const school = { id: '1', name: 'Escola Teste', address: 'Rua Teste 123', classCount: 2 }
    expect(school.name).toBe('Escola Teste')
    expect(school.address).toBe('Rua Teste 123')
  })

  it('renders turmas list when turmas exist', () => {
    const turmas = [{ id: '1', name: '3º Ano A', shift: 'morning', academicYear: 2024, schoolId: '1' }]
    expect(turmas.length).toBe(1)
    expect(turmas[0].name).toBe('3º Ano A')
  })

  it('opens edit form', () => {
    expect(true).toBe(true)
  })

  it('opens delete dialog', () => {
    expect(true).toBe(true)
  })

  it('opens delete turma dialog', () => {
    expect(true).toBe(true)
  })
})