import { School } from '../../domain/entities/School'
import { Turma } from '../../domain/entities/Turma'

export const dataStore = {
  schools: [] as School[],
  turmas: [] as Turma[],
}

export function computeClassCount(schoolId: string): number {
  return dataStore.turmas.filter((t) => t.schoolId === schoolId).length
}
