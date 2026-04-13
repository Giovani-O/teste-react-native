import {
  CreateSchoolDTO,
  School,
  UpdateSchoolDTO,
} from '../../domain/entities/School'
import { ISchoolRepository } from '../../domain/repositories/ISchoolRepository'
import { adaptSchool, adaptSchoolList } from '../adapters/school.adapter'

const BASE_URL = 'http://localhost/api'

export class SchoolRepository implements ISchoolRepository {
  async findAll(): Promise<School[]> {
    const response = await fetch(`${BASE_URL}/schools`)
    if (!response.ok) {
      throw new Error('Failed to fetch schools')
    }
    const data = await response.json()
    return adaptSchoolList(data)
  }

  async findById(id: string): Promise<School | null> {
    const response = await fetch(`${BASE_URL}/schools/${id}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error('Failed to fetch school')
    }
    const data = await response.json()
    return adaptSchool(data)
  }

  async create(data: CreateSchoolDTO): Promise<School> {
    const response = await fetch(`${BASE_URL}/schools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create school')
    }
    const result = await response.json()
    return adaptSchool(result)
  }

  async update(id: string, data: UpdateSchoolDTO): Promise<School | null> {
    const response = await fetch(`${BASE_URL}/schools/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error('Failed to update school')
    }
    const result = await response.json()
    return adaptSchool(result)
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/schools/${id}`, {
      method: 'DELETE',
    })
    if (response.status === 404) {
      return false
    }
    if (!response.ok) {
      throw new Error('Failed to delete school')
    }
    return true
  }
}
