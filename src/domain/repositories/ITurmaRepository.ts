import { CreateTurmaDTO, Turma, UpdateTurmaDTO } from '../entities/Turma'

export interface ITurmaRepository {
  findBySchoolId(schoolId: string): Promise<Turma[]>
  findById(id: string): Promise<Turma | null>
  create(data: CreateTurmaDTO): Promise<Turma>
  update(id: string, data: UpdateTurmaDTO): Promise<Turma | null>
  delete(id: string): Promise<boolean>
}
