import { School } from '../../domain/entities/School'
import { Turma } from '../../domain/entities/Turma'

export const mockSchools: School[] = [
  {
    id: '1',
    name: 'Escola Municipal João Paulo II',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    classCount: 3,
  },
  {
    id: '2',
    name: 'Colégio Estadual Vila Nova',
    address: 'Avenida Brasil, 456 - Vila Nova, Curitiba - PR',
    classCount: 2,
  },
  {
    id: '3',
    name: 'Instituto de Educação Manager',
    address: 'Rua Augusta, 789 - Consolação, São Paulo - SP',
    classCount: 4,
  },
]

export const mockTurmas: Record<string, Turma[]> = {
  '1': [
    {
      id: 't1',
      name: '1º Ano A',
      shift: 'morning',
      academicYear: 2026,
      schoolId: '1',
    },
    {
      id: 't2',
      name: '2º Ano A',
      shift: 'afternoon',
      academicYear: 2026,
      schoolId: '1',
    },
    {
      id: 't3',
      name: '3º Ano A',
      shift: 'evening',
      academicYear: 2026,
      schoolId: '1',
    },
  ],
  '2': [
    {
      id: 't4',
      name: '1º Ano B',
      shift: 'morning',
      academicYear: 2026,
      schoolId: '2',
    },
    {
      id: 't5',
      name: '2º Ano B',
      shift: 'afternoon',
      academicYear: 2026,
      schoolId: '2',
    },
  ],
  '3': [
    {
      id: 't6',
      name: '1º Ano C',
      shift: 'morning',
      academicYear: 2026,
      schoolId: '3',
    },
    {
      id: 't7',
      name: '2º Ano C',
      shift: 'morning',
      academicYear: 2026,
      schoolId: '3',
    },
    {
      id: 't8',
      name: '3º Ano C',
      shift: 'afternoon',
      academicYear: 2026,
      schoolId: '3',
    },
    {
      id: 't9',
      name: '4º Ano C',
      shift: 'evening',
      academicYear: 2026,
      schoolId: '3',
    },
  ],
}
