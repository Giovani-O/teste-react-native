import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { Plus, Search } from 'lucide-react-native'
import { Text } from '@/components/ui/text'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { FAB } from '../../components/FAB'
import { SchoolFormBottomSheet } from '../../components/SchoolFormBottomSheet'
import { TurmaFilterBottomSheet } from '../../components/TurmaFilterBottomSheet'
import { TurmaFormBottomSheet } from '../../components/TurmaFormBottomSheet'
import { Shift, Turma } from '../../domain/entities/Turma'
import { useSchoolsStore } from '../../store/schools.store'
import { useTurmasStore } from '../../store/turmas.store'
import { useTurmaFilter } from '../../hooks/useTurmaFilter'
import { SchoolCard } from '../../components/SchoolCard'
import { EmptyState } from '../../components/EmptyState'
import { TurmaListItem } from '../../components/TurmaListItem'

export function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()

  const {
    updateSchool,
    deleteSchool,
    incrementClassCount,
    decrementClassCount,
    isLoading: schoolLoading,
  } = useSchoolsStore()
  const {
    turmas,
    isLoading,
    fetchTurmasBySchool,
    deleteTurmaBySchoolId,
    createTurma,
    updateTurma,
    deleteTurma,
  } = useTurmasStore()

  const school = useSchoolsStore((state) =>
    state.schools.find((s) => s.id === id),
  )

  const [editingTurma, setEditingTurma] = useState<Turma | null>(null)
  const [editTurmaOpen, setEditTurmaOpen] = useState(false)
  const [deleteTurmaOpen, setDeleteTurmaOpen] = useState(false)
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null)
  const [turmaFilterOpen, setTurmaFilterOpen] = useState(false)

  const {
    filters: turmaFilters,
    setFilters: setTurmaFilters,
    filteredTurmas,
    activeFilterCount,
  } = useTurmaFilter(turmas)

  useEffect(() => {
    if (id) {
      fetchTurmasBySchool(id)
    }
  }, [id, fetchTurmasBySchool])

  const handleEdit = async (data: { name: string; address: string }) => {
    if (!id) return
    await updateSchool(id, data)
    setEditOpen(false)
  }

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await deleteTurmaBySchoolId(id)
      await deleteSchool(id)
      setDeleteOpen(false)
      router.back()
    } catch (error) {
      console.error('Failed to delete school:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCreateTurma = async (data: {
    name: string
    shift: Shift
    academicYear: number
  }) => {
    if (!id) return
    const previousTurmasCount = useTurmasStore.getState().turmas.length
    await createTurma({ ...data, schoolId: id })
    const { error: createTurmaError, turmas: updatedTurmas } =
      useTurmasStore.getState()
    if (!createTurmaError && updatedTurmas.length > previousTurmasCount) {
      incrementClassCount(id, 1)
      setCreateOpen(false)
    }
  }

  if (!school) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-500">Escola não encontrada</Text>
      </View>
    )
  }

  const handleEditTurma = async (data: {
    name: string
    shift: Shift
    academicYear: number
  }) => {
    if (!editingTurma?.id) return
    await updateTurma(editingTurma.id, data)
    setEditTurmaOpen(false)
    setEditingTurma(null)
  }

  const handleDeleteTurma = async () => {
    if (!selectedTurma?.id || !id) return
    const turmaId = selectedTurma.id
    const turmaExistedBeforeDelete = useTurmasStore
      .getState()
      .turmas.some((turma) => turma.id === turmaId)
    await deleteTurma(turmaId)
    const turmaStillExists = useTurmasStore
      .getState()
      .turmas.some((turma) => turma.id === turmaId)
    if (turmaExistedBeforeDelete && !turmaStillExists) {
      decrementClassCount(id, 1)
      setDeleteTurmaOpen(false)
      setSelectedTurma(null)
    }
  }

  return (
    <View className="flex-1 bg-white">
      <SchoolCard
        school={school}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

      <Text className="text-base font-semibold text-gray-900 px-4 pt-4 pb-2 border-t border-gray-200">
        Turmas
      </Text>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator />
        </View>
      ) : filteredTurmas.length === 0 ? (
        <EmptyState
          title={
            turmas.length === 0
              ? 'Nenhuma turma encontrada'
              : 'Nenhuma turma atende ao filtro'
          }
          subtitle={
            turmas.length === 0
              ? 'Toque no botão + para adicionar uma turma'
              : 'Tente ajustar os filtros'
          }
        />
      ) : (
        <ScrollView className="flex-1" bounces={false}>
          {filteredTurmas.map((turma) => (
            <TurmaListItem
              key={turma.id}
              turma={turma}
              onEdit={(t) => {
                setEditingTurma(t)
                setEditTurmaOpen(true)
              }}
              onDelete={(t) => {
                setSelectedTurma(t)
                setDeleteTurmaOpen(true)
              }}
            />
          ))}
        </ScrollView>
      )}

      <FAB
        label="Filtrar turmas"
        onPress={() => setTurmaFilterOpen(true)}
        icon={<Search size={32} color="white" />}
        badge={activeFilterCount}
        backgroundColor="#6B7280"
        position="left"
      />

      <FAB
        label="Adicionar turma"
        onPress={() => setCreateOpen(true)}
        icon={<Plus size={32} color="white" />}
      />

      <TurmaFormBottomSheet
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreateTurma}
      />

      <TurmaFormBottomSheet
        isOpen={editTurmaOpen}
        onClose={() => {
          setEditTurmaOpen(false)
          setEditingTurma(null)
        }}
        onSave={handleEditTurma}
        initialValues={editingTurma ?? undefined}
        isLoading={isLoading}
      />

      <SchoolFormBottomSheet
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEdit}
        initialValues={school}
        isLoading={schoolLoading}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Escola"
        message={`Tem certeza que deseja excluir "${school.name}"? Esta ação não pode ser desfeita e todas as turmas associadas serão excluídas.`}
        isLoading={isDeleting || schoolLoading}
      />

      <ConfirmDialog
        isOpen={deleteTurmaOpen}
        onClose={() => {
          setDeleteTurmaOpen(false)
          setSelectedTurma(null)
        }}
        onConfirm={handleDeleteTurma}
        title="Excluir Turma"
        message={`Tem certeza que deseja excluir "${selectedTurma?.name}"? Esta ação não pode ser desfeita.`}
        isLoading={isLoading}
      />

      <TurmaFilterBottomSheet
        isOpen={turmaFilterOpen}
        onClose={() => setTurmaFilterOpen(false)}
        filters={turmaFilters}
        onFiltersChange={setTurmaFilters}
      />
    </View>
  )
}
