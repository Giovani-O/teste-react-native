import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Plus, Search } from 'lucide-react-native'
import { FAB } from '../../components/FAB'
import { SchoolFormBottomSheet } from '../../components/SchoolFormBottomSheet'
import { FilterBottomSheet } from '../../components/FilterBottomSheet'
import { useSchoolsStore } from '../../store/schools.store'
import { useSchoolFilter } from '../../hooks/useSchoolFilter'
import { SchoolListItem } from '../../components/SchoolListItem'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'

export function SchoolListScreen() {
  const router = useRouter()
  const { schools, fetchSchools, createSchool, isLoading, error } =
    useSchoolsStore()
  const [createOpen, setCreateOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const { filters, setFilters, filteredSchools, activeFilterCount } =
    useSchoolFilter(schools)

  useEffect(() => {
    fetchSchools()
  }, [fetchSchools])

  const handleCreate = async (data: { name: string; address: string }) => {
    await createSchool(data)
    setCreateOpen(false)
  }

  const handleSchoolPress = (id: string) => {
    router.push(`/schools/${id}`)
  }

  return (
    <View className="flex-1 bg-white">
      <ErrorBanner message={error} />
      {filteredSchools.length === 0 ? (
        <EmptyState
          title={
            schools.length === 0
              ? 'Nenhuma escola encontrada'
              : 'Nenhuma escola atende ao filtro'
          }
          subtitle={
            schools.length === 0
              ? 'Toque no botão + para adicionar uma escola'
              : 'Tente ajustar os filtros'
          }
        />
      ) : (
        <ScrollView className="flex-1 border-t border-gray-200" bounces={false}>
          {filteredSchools.map((school) => (
            <SchoolListItem
              key={school.id}
              school={school}
              onPress={handleSchoolPress}
            />
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
        icon={<Plus size={32} color="white" />}
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
