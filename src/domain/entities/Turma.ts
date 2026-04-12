export type Shift = 'morning' | 'afternoon' | 'evening'

export interface Turma {
  id: string
  name: string
  shift: Shift
  academicYear: number
  schoolId: string
}

export interface CreateTurmaDTO {
  name: string
  shift: Shift
  academicYear: number
  schoolId: string
}

export interface UpdateTurmaDTO {
  name?: string
  shift?: Shift
  academicYear?: number
}
