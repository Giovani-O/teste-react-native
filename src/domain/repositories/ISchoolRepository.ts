import { CreateSchoolDTO, School, UpdateSchoolDTO } from '../entities/School'

export interface ISchoolRepository {
  findAll(): Promise<School[]>
  findById(id: string): Promise<School | null>
  create(data: CreateSchoolDTO): Promise<School>
  update(id: string, data: UpdateSchoolDTO): Promise<School | null>
  delete(id: string): Promise<boolean>
}
