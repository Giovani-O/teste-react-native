import { useRouter } from 'expo-router'
import { useEffect, useState, useMemo } from 'react'
import { ScrollView, View } from 'react-native'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { Search } from 'lucide-react-native'
import { FAB } from '../../components/FAB'
import { FilterBottomSheet } from '../../components/FilterBottomSheet'
import { SchoolFormBottomSheet } from '../../components/SchoolFormBottomSheet'
import { useSchoolsStore } from '../../store/schools.store'

interface Filters {
  name: string
  address: string
}

export function SchoolListScreen() {
  const router = useRouter()
  const { schools, fetchSchools, createSchool, isLoading, error } =
    useSchoolsStore()
  const [createOpen, setCreateOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({ name: '', address: '' })

  useEffect(() => {
    fetchSchools()
  }, [fetchSchools])

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

  const handleCreate = async (data: { name: string; address: string }) => {
    await createSchool(data)
    setCreateOpen(false)
  }

  const handleSchoolPress = (id: string) => {
    router.push(`/schools/${id}`)
  }

  return (
    <View className="flex-1 bg-white">
      {error ? (
        <View className="p-4 bg-red-50 border-b border-red-200">
          <Text className="text-sm text-red-700">{error}</Text>
        </View>
      ) : null}
      {filteredSchools.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-lg text-gray-500 text-center mb-2">
            {schools.length === 0
              ? 'Nenhuma escola encontrada'
              : 'Nenhuma escola atende ao filtro'}
          </Text>
          <Text className="text-sm text-gray-400 text-center">
            {schools.length === 0
              ? 'Toque no botão + para adicionar uma escola'
              : 'Tente ajustar os filtros'}
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 border-t border-gray-200" bounces={false}>
          {filteredSchools.map((school) => (
            <Pressable
              key={school.id}
              className="px-4 py-5 border-b border-gray-200 bg-white active:bg-gray-50 min-h-[88px]"
              onPress={() => handleSchoolPress(school.id)}
            >
              <Text className="text-base font-semibold text-gray-900 mb-0.5">
                {school.name}
              </Text>
              <Text className="text-sm text-gray-500 mb-1">
                {school.address}
              </Text>
              <Text className="text-xs text-gray-400">
                {school.classCount}{' '}
                {school.classCount === 1 ? 'turma' : 'turmas'}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <FAB
        label="Filtrar escolas"
        onPress={() => setFilterOpen(true)}
        icon={<Search size={32} color="white" />}
        badge={activeFilterCount}
        backgroundColor="#6B7280"
        position="left"
      />

      <FAB
        label="Adicionar escola"
        onPress={() => setCreateOpen(true)}
        position="right"
      />

      <SchoolFormBottomSheet
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
        isLoading={isLoading}
      />

      <FilterBottomSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </View>
  )
}
