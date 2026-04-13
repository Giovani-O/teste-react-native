import { useEffect, useState } from 'react'
import { TextInput, View } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { School } from '../domain/entities/School'
import { BottomSheet } from './BottomSheet'

interface SchoolFormData {
  name: string
  address: string
}

interface SchoolFormBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: SchoolFormData) => Promise<void>
  initialValues?: School
  isLoading?: boolean
}

export function SchoolFormBottomSheet({
  isOpen,
  onClose,
  onSave,
  initialValues,
  isLoading,
}: SchoolFormBottomSheetProps) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName(initialValues?.name ?? '')
      setAddress(initialValues?.address ?? '')
    }
  }, [isOpen, initialValues?.name, initialValues?.address])

  const isEditing = !!initialValues
  const canSave = name.trim() && address.trim()

  const handleSave = async () => {
    if (!canSave) return
    await onSave({ name: name.trim(), address: address.trim() })
    if (!isEditing) {
      setName('')
      setAddress('')
    }
    onClose()
  }

  const handleClose = () => {
    setName(initialValues?.name ?? '')
    setAddress(initialValues?.address ?? '')
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <View className="p-4 w-full">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          {isEditing ? 'Editar Escola' : 'Nova Escola'}
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
            onPress={handleClose}
          >
            <ButtonText className="text-gray-700 text-base">
              Cancelar
            </ButtonText>
          </Button>
          <Button
            className="flex-1 h-14"
            onPress={handleSave}
            isDisabled={isLoading || !canSave}
          >
            <ButtonText className="text-base">Salvar</ButtonText>
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
}
