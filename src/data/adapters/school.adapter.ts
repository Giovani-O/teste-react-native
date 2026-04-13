import { School } from '../../domain/entities/School'

export interface RawSchoolResponse {
  id: string
  name: string
  address: string
  classCount: number
}

export function adaptSchool(raw: RawSchoolResponse): School {
  return {
    id: raw.id,
    name: raw.name,
    address: raw.address,
    classCount: raw.classCount ?? 0,
  }
}

export function adaptSchoolList(raw: RawSchoolResponse[]): School[] {
  return raw.map(adaptSchool)
}
