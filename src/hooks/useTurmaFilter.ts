import { useMemo, useState } from 'react'
import { Shift, Turma } from '../domain/entities/Turma'

interface TurmaFilters {
  name: string
  shift: Shift | ''
  academicYear: string
}

export function useTurmaFilter(turmas: Turma[]) {
  const [filters, setFilters] = useState<TurmaFilters>({
    name: '',
    shift: '',
    academicYear: '',
  })

  const filteredTurmas = useMemo(() => {
    return turmas.filter((turma) => {
      const matchesName =
        !filters.name ||
        turma.name.toLowerCase().includes(filters.name.toLowerCase())
      const matchesShift = !filters.shift || turma.shift === filters.shift
      const matchesYear =
        !filters.academicYear ||
        turma.academicYear.toString().includes(filters.academicYear)
      return matchesName && matchesShift && matchesYear
    })
  }, [turmas, filters])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.name) count++
    if (filters.shift) count++
    if (filters.academicYear) count++
    return count
  }, [filters])

  return {
    filters,
    setFilters,
    filteredTurmas,
    activeFilterCount,
  }
}
