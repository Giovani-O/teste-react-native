import { faker } from '@faker-js/faker'
import { School } from '../../domain/entities/School'
import { Turma } from '../../domain/entities/Turma'

function generateSchools(): School[] {
  return [
    {
      id: crypto.randomUUID(),
      name: faker.string.sample(),
      address: faker.location.streetAddress(),
      classCount: 0,
    },
    {
      id: crypto.randomUUID(),
      name: faker.string.sample(),
      address: faker.location.streetAddress(),
      classCount: 0,
    },
  ]
}

function generateTurmas(schoolsData: School[]): Turma[] {
  if (schoolsData.length < 2) return []

  const turmasList: Turma[] = []

  for (const school of schoolsData) {
    for (let s = 0; s < 2; s++) {
      for (let sec = 0; sec < 2; sec++) {
        turmasList.push({
          id: crypto.randomUUID(),
          name: `${faker.string.fromCharacters(['1', '2', '3'])}º Ano ${faker.string.fromCharacters(['A', 'B', 'C'])}`,
          shift: 'morning',
          academicYear: 2026,
          schoolId: school.id,
        })
      }
    }
  }

  turmasList.push({
    id: crypto.randomUUID(),
    name: '3º Ano A',
    shift: 'morning',
    academicYear: 2025,
    schoolId: schoolsData[1].id,
  })

  return turmasList
}

const initialSchools = generateSchools()
const initialTurmas = generateTurmas(initialSchools)

export const dataStore = {
  schools: [...initialSchools],
  turmas: [...initialTurmas],
}

export function computeClassCount(schoolId: string): number {
  return dataStore.turmas.filter((t) => t.schoolId === schoolId).length
}

export function resetDataStore(): void {
  dataStore.schools = generateSchools()
  dataStore.turmas = generateTurmas(dataStore.schools)
}
