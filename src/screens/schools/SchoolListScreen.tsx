import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, TextInput, View } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { BottomSheet } from '../../components/BottomSheet'
import { FAB } from '../../components/FAB'
import { useSchoolsStore } from '../../store/schools.store'

export function SchoolListScreen() {
  const router = useRouter()
  const { schools, fetchSchools, createSchool, isLoading, error } =
    useSchoolsStore()
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    fetchSchools()
  }, [fetchSchools])

  const handleCreate = async () => {
    if (!name.trim() || !address.trim()) return
    await createSchool({ name: name.trim(), address: address.trim() })
    setName('')
    setAddress('')
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

      <FAB label="Adicionar escola" onPress={() => setCreateOpen(true)} />

      <BottomSheet isOpen={createOpen} onClose={() => setCreateOpen(false)}>
        <View className="p-4 w-full">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Nova Escola
          </Text>

          <Text className="text-sm font-medium text-gray-700 mb-1.5">Nome</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-4 mb-4 text-lg text-gray-900 bg-white"
            placeholder="Nome da escola"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

          <Text className="text-sm font-medium text-gray-700 mb-1.5">
            Endereço
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-4 mb-6 text-lg text-gray-900 bg-white"
            placeholder="Endereço da escola"
            placeholderTextColor="#9CA3AF"
            value={address}
            onChangeText={setAddress}
          />

          <View className="flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 h-14"
              onPress={() => {
                setName('')
                setAddress('')
                setCreateOpen(false)
              }}
            >
              <ButtonText className="text-gray-700 text-base">
                Cancelar
              </ButtonText>
            </Button>
            <Button
              className="flex-1 h-14"
              onPress={handleCreate}
              isDisabled={isLoading || !name.trim() || !address.trim()}
            >
              <ButtonText className="text-base">Salvar</ButtonText>
            </Button>
          </View>
        </View>
      </BottomSheet>
    </View>
  )
}
