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
    console.log(
      '[SchoolRepository] findAll() called, fetching',
      `${BASE_URL}/schools`,
    )
    const response = await fetch(`${BASE_URL}/schools`)
    console.log(
      '[SchoolRepository] findAll() response status:',
      response.status,
    )
    if (!response.ok) {
      const body = await response.text()
      console.log('[SchoolRepository] findAll() 500 body:', body)
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
    console.log('[SchoolRepository] create() called with', data)
    const response = await fetch(`${BASE_URL}/schools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    console.log('[SchoolRepository] create() response status:', response.status)
    if (!response.ok) {
      const body = await response.text()
      console.log('[SchoolRepository] create() 500 body:', body)
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
