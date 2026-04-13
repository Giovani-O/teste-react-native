import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState, useMemo } from 'react'
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'
import {
  EllipsisVertical,
  PencilLine,
  Plus,
  Search,
  Trash,
} from 'lucide-react-native'
import { Text } from '@/components/ui/text'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { FAB } from '../../components/FAB'
import { SchoolFormBottomSheet } from '../../components/SchoolFormBottomSheet'
import { TurmaFilterBottomSheet } from '../../components/TurmaFilterBottomSheet'
import { TurmaFormBottomSheet } from '../../components/TurmaFormBottomSheet'
import { Shift, Turma } from '../../domain/entities/Turma'
import { useSchoolsStore } from '../../store/schools.store'
import { useTurmasStore } from '../../store/turmas.store'

const shiftLabels: Record<Shift, string> = {
  morning: 'Manhã',
  afternoon: 'Tarde',
  evening: 'Noite',
}

const shiftClassNames: Record<Shift, string> = {
  morning: 'bg-[#0066CC]',
  afternoon: 'bg-[#7C3AED]',
  evening: 'bg-[#059669]',
}

export function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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

  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null)
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null)
  const [editTurmaOpen, setEditTurmaOpen] = useState(false)
  const [deleteTurmaOpen, setDeleteTurmaOpen] = useState(false)
  const [turmaFilterOpen, setTurmaFilterOpen] = useState(false)
  const [turmaFilters, setTurmaFilters] = useState<{
    name: string
    shift: Shift | ''
    academicYear: string
  }>({ name: '', shift: '', academicYear: '' })

  const filteredTurmas = useMemo(() => {
    return turmas.filter((turma) => {
      const matchesName =
        !turmaFilters.name ||
        turma.name.toLowerCase().includes(turmaFilters.name.toLowerCase())
      const matchesShift =
        !turmaFilters.shift || turma.shift === turmaFilters.shift
      const matchesYear =
        !turmaFilters.academicYear ||
        turma.academicYear.toString().includes(turmaFilters.academicYear)
      return matchesName && matchesShift && matchesYear
    })
  }, [turmas, turmaFilters])

  const activeTurmaFilterCount = useMemo(() => {
    let count = 0
    if (turmaFilters.name) count++
    if (turmaFilters.shift) count++
    if (turmaFilters.academicYear) count++
    return count
  }, [turmaFilters])

  useEffect(() => {
    if (id) {
      fetchTurmasBySchool(id)
    }
  }, [id, fetchTurmasBySchool])

  const handleEdit = async (data: { name: string; address: string }) => {
    if (!id) return
    await updateSchool(id, data)
    setEditOpen(false)
    setMenuOpen(false)
  }

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await deleteTurmaBySchoolId(id)
      await deleteSchool(id)
      setDeleteOpen(false)
      setMenuOpen(false)
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
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              {school.name}
            </Text>
            <Text className="text-sm text-gray-500 mb-2">{school.address}</Text>
            <Text className="text-xs text-gray-400">
              {school.classCount}{' '}
              {school.classCount === 1
                ? 'turma cadastrada'
                : 'turmas cadastradas'}
            </Text>
          </View>
          <View className="relative">
            <Pressable
              className="p-3 -m-1"
              onPress={() => setMenuOpen(!menuOpen)}
              accessibilityLabel="Mais opções"
              accessibilityRole="button"
            >
              <EllipsisVertical size={24} color="#6B7280" />
            </Pressable>
            {menuOpen && (
              <View className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <Pressable
                  className="flex-row items-center px-4 py-3.5 border-b border-gray-100"
                  onPress={() => {
                    setMenuOpen(false)
                    setEditOpen(true)
                  }}
                >
                  <PencilLine size={20} color="#374151" />
                  <Text className="text-gray-700 ml-3 text-[15px]">
                    Editar escola
                  </Text>
                </Pressable>
                <Pressable
                  className="flex-row items-center px-4 py-3.5"
                  onPress={() => {
                    setMenuOpen(false)
                    setDeleteOpen(true)
                  }}
                >
                  <Trash size={20} color="#DC2626" />
                  <Text className="text-red-600 ml-3 text-[15px]">
                    Excluir escola
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text className="text-base font-semibold text-gray-900 px-4 pt-4 pb-2 border-t border-gray-200">
        Turmas
      </Text>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator />
        </View>
      ) : filteredTurmas.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-base text-gray-500 text-center mb-2">
            {turmas.length === 0
              ? 'Nenhuma turma encontrada'
              : 'Nenhuma turma atende ao filtro'}
          </Text>
          <Text className="text-sm text-gray-400 text-center">
            {turmas.length === 0
              ? 'Toque no botão + para adicionar uma turma'
              : 'Tente ajustar os filtros'}
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1" bounces={false}>
          {filteredTurmas.map((turma) => (
            <View
              key={turma.id}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-gray-200 bg-white"
            >
              <View className="flex-1">
                <Text className="text-[15px] font-medium text-gray-900 mb-0.5">
                  {turma.name}
                </Text>
                <Text className="text-[13px] text-gray-500">
                  {turma.academicYear}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View
                  className={`px-2.5 py-1 rounded-xl ${shiftClassNames[turma.shift]}`}
                >
                  <Text className="text-xs font-medium text-white">
                    {shiftLabels[turma.shift]}
                  </Text>
                </View>
                <View className="relative ml-2">
                  <Pressable
                    className="p-2 -m-1"
                    onPress={() => setSelectedTurma(turma)}
                    accessibilityLabel="Mais opções"
                    accessibilityRole="button"
                  >
                    <EllipsisVertical size={20} color="#6B7280" />
                  </Pressable>
                  {selectedTurma?.id === turma.id && (
                    <View className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <Pressable
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                        onPress={() => {
                          setEditingTurma(turma)
                          setEditTurmaOpen(true)
                          setSelectedTurma(null)
                        }}
                      >
                        <PencilLine size={18} color="#374151" />
                        <Text className="text-gray-700 ml-2.5 text-[14px]">
                          Editar turma
                        </Text>
                      </Pressable>
                      <Pressable
                        className="flex-row items-center px-4 py-3"
                        onPress={() => {
                          setDeleteTurmaOpen(true)
                        }}
                      >
                        <Trash size={18} color="#DC2626" />
                        <Text className="text-red-600 ml-2.5 text-[14px]">
                          Excluir turma
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <FAB
        label="Filtrar turmas"
        onPress={() => setTurmaFilterOpen(true)}
        icon={<Search size={32} color="white" />}
        badge={activeTurmaFilterCount}
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
