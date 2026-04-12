import { ISchoolRepository } from '../../domain/repositories/ISchoolRepository'
import { ITurmaRepository } from '../../domain/repositories/ITurmaRepository'
import { SchoolRepository } from './SchoolRepository'
import { TurmaRepository } from './TurmaRepository'

export class RepositoryFactory {
  static createSchoolRepository(): ISchoolRepository {
    return new SchoolRepository()
  }

  static createTurmaRepository(): ITurmaRepository {
    return new TurmaRepository()
  }
}
