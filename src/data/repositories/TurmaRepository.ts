import Constants from 'expo-constants'

import {
  CreateTurmaDTO,
  Turma,
  UpdateTurmaDTO,
} from '../../domain/entities/Turma'
import { ITurmaRepository } from '../../domain/repositories/ITurmaRepository'
import { adaptTurma, adaptTurmaList } from '../adapters/turma.adapter'

const BASE_URL = `${Constants.expoConfig?.extra?.baseUrl}/api`

export class TurmaRepository implements ITurmaRepository {
  async findBySchoolId(schoolId: string): Promise<Turma[]> {
    const response = await fetch(`${BASE_URL}/schools/${schoolId}/turmas`)
    if (!response.ok) {
      throw new Error('Failed to fetch turmas')
    }
    const data = await response.json()
    return adaptTurmaList(data)
  }

  async findById(id: string): Promise<Turma | null> {
    const response = await fetch(`${BASE_URL}/turmas/${id}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error('Failed to fetch turma')
    }
    const data = await response.json()
    return adaptTurma(data)
  }

  async create(data: CreateTurmaDTO): Promise<Turma> {
    const response = await fetch(`${BASE_URL}/turmas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create turma')
    }
    const result = await response.json()
    return adaptTurma(result)
  }

  async update(id: string, data: UpdateTurmaDTO): Promise<Turma | null> {
    const response = await fetch(`${BASE_URL}/turmas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error('Failed to update turma')
    }
    const result = await response.json()
    return adaptTurma(result)
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/turmas/${id}`, {
      method: 'DELETE',
    })
    if (response.status === 404) {
      return false
    }
    if (!response.ok) {
      throw new Error('Failed to delete turma')
    }
    return true
  }
}
