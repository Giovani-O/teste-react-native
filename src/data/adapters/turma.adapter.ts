import { Shift, Turma } from '../../domain/entities/Turma'

export interface RawTurmaResponse {
  id: string
  name: string
  shift: Shift
  academicYear: number
  schoolId: string
}

export function adaptTurma(raw: RawTurmaResponse): Turma {
  return {
    id: raw.id,
    name: raw.name,
    shift: raw.shift,
    academicYear: raw.academicYear,
    schoolId: raw.schoolId,
  }
}

export function adaptTurmaList(raw: RawTurmaResponse[]): Turma[] {
  return raw.map(adaptTurma)
}
