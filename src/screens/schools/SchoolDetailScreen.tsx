import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'
import { EllipsisVertical, PencilLine, Trash } from 'lucide-react-native'
import { Text } from '@/components/ui/text'
import { BottomSheet } from '../../components/BottomSheet'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { FAB } from '../../components/FAB'
import { SchoolFormBottomSheet } from '../../components/SchoolFormBottomSheet'
import { Shift } from '../../domain/entities/Turma'
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
    isLoading: schoolLoading,
  } = useSchoolsStore()
  const { turmas, isLoading, fetchTurmasBySchool, deleteTurmaBySchoolId } =
    useTurmasStore()

  const school = useSchoolsStore((state) =>
    state.schools.find((s) => s.id === id),
  )

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
    await deleteTurmaBySchoolId(id)
    await deleteSchool(id)
    setDeleteOpen(false)
    setMenuOpen(false)
    router.back()
  }

  if (!school) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-500">Escola não encontrada</Text>
      </View>
    )
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
      ) : turmas.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-base text-gray-500 text-center mb-2">
            Nenhuma turma encontrada
          </Text>
          <Text className="text-sm text-gray-400 text-center">
            Toque no botão + para adicionar uma turma
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1" bounces={false}>
          {turmas.map((turma) => (
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
              <View
                className={`px-2.5 py-1 rounded-xl ml-3 ${shiftClassNames[turma.shift]}`}
              >
                <Text className="text-xs font-medium text-white">
                  {shiftLabels[turma.shift]}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <FAB label="Adicionar turma" onPress={() => setCreateOpen(true)} />

      <BottomSheet isOpen={createOpen} onClose={() => setCreateOpen(false)}>
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Nova Turma
          </Text>
          <Text className="text-sm text-gray-500">Em construção...</Text>
        </View>
      </BottomSheet>

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
    </View>
  )
}
