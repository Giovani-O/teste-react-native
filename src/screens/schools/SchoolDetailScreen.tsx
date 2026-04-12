import { Text } from '@/components/ui/text'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { BottomSheet } from '../../components/BottomSheet'
import { FAB } from '../../components/FAB'
import { mockSchools, mockTurmas } from '../../data/mocks/mockData'
import { School } from '../../domain/entities/School'
import { Shift, Turma } from '../../domain/entities/Turma'

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
  const [school, setSchool] = useState<School | null>(null)
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    const found = mockSchools.find((s) => s.id === id)
    setSchool(found ?? null)
    setTurmas(mockTurmas[id as string] ?? [])
  }, [id])

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
        <Text className="text-xl font-bold text-gray-900 mb-1">
          {school.name}
        </Text>
        <Text className="text-sm text-gray-500 mb-2">{school.address}</Text>
        <Text className="text-xs text-gray-400">
          {school.classCount}{' '}
          {school.classCount === 1 ? 'turma cadastrada' : 'turmas cadastradas'}
        </Text>
      </View>

      <Text className="text-base font-semibold text-gray-900 px-4 pt-4 pb-2 border-t border-gray-200">
        Turmas
      </Text>

      {turmas.length === 0 ? (
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

      <FAB onPress={() => setCreateOpen(true)} />

      <BottomSheet isOpen={createOpen} onClose={() => setCreateOpen(false)}>
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Nova Turma
          </Text>
          <Text className="text-sm text-gray-500">Em construção...</Text>
        </View>
      </BottomSheet>
    </View>
  )
}
