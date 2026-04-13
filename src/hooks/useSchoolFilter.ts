import { useMemo, useState } from 'react'
import { School } from '../domain/entities/School'

interface SchoolFilters {
  name: string
  address: string
}

export function useSchoolFilter(schools: School[]) {
  const [filters, setFilters] = useState<SchoolFilters>({
    name: '',
    address: '',
  })

  const filteredSchools = useMemo(() => {
    const nameLower = filters.name.toLowerCase()
    const addressLower = filters.address.toLowerCase()

    return schools.filter((school) => {
      const matchesName =
        !filters.name || school.name.toLowerCase().includes(nameLower)
      const matchesAddress =
        !filters.address || school.address.toLowerCase().includes(addressLower)
      return matchesName && matchesAddress
    })
  }, [schools, filters])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.name) count++
    if (filters.address) count++
    return count
  }, [filters])

  return {
    filters,
    setFilters,
    filteredSchools,
    activeFilterCount,
  }
}
