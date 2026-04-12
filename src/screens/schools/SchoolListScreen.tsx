import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { BottomSheet } from '../../components/BottomSheet'
import { FAB } from '../../components/FAB'
import { mockSchools } from '../../data/mocks/mockData'
import { School } from '../../domain/entities/School'

export function SchoolListScreen() {
  const router = useRouter()
  const [schools] = useState<School[]>(mockSchools)
  const [createOpen, setCreateOpen] = useState(false)

  const handleSchoolPress = (id: string) => {
    router.push(`/schools/${id}`)
  }

  return (
    <View className="flex-1 bg-white">
      {schools.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-lg text-gray-500 text-center mb-2">
            Nenhuma escola encontrada
          </Text>
          <Text className="text-sm text-gray-400 text-center">
            Toque no botão + para adicionar uma escola
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 border-t border-gray-200" bounces={false}>
          {schools.map((school) => (
            <Pressable
              key={school.id}
              className="px-4 py-3.5 border-b border-gray-200 bg-white active:bg-gray-50"
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

      <FAB label="Adicionar escola" onPress={() => setCreateOpen(true)} />

      <BottomSheet isOpen={createOpen} onClose={() => setCreateOpen(false)}>
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Nova Escola
          </Text>
          <Text className="text-sm text-gray-500">Em construção...</Text>
        </View>
      </BottomSheet>
    </View>
  )
}
