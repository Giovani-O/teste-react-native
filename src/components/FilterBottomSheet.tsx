import { useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { X } from 'lucide-react-native'
import { BottomSheet } from './BottomSheet'

interface Filters {
  name: string
  address: string
}

interface FilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function FilterBottomSheet({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: FilterBottomSheetProps) {
  const [localName, setLocalName] = useState(filters.name)
  const [localAddress, setLocalAddress] = useState(filters.address)

  const handleOpen = () => {
    setLocalName(filters.name)
    setLocalAddress(filters.address)
  }

  const handleNameChange = (value: string) => {
    setLocalName(value)
    onFiltersChange({ name: value, address: localAddress })
  }

  const handleAddressChange = (value: string) => {
    setLocalAddress(value)
    onFiltersChange({ name: localName, address: value })
  }

  const clearName = () => {
    setLocalName('')
    onFiltersChange({ name: '', address: localAddress })
  }

  const clearAddress = () => {
    setLocalAddress('')
    onFiltersChange({ name: localName, address: '' })
  }

  const clearAll = () => {
    setLocalName('')
    setLocalAddress('')
    onFiltersChange({ name: '', address: '' })
  }

  const handleClose = () => {
    setLocalName(filters.name)
    setLocalAddress(filters.address)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} onOpen={handleOpen}>
      <View className="p-4 w-full">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Filtrar Escolas
        </Text>

        <Text className="text-sm font-medium text-gray-700 mb-1.5">Nome</Text>
        <View className="relative mb-4">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-4 pr-10 text-lg text-gray-900 bg-white"
            placeholder="Buscar por nome..."
            placeholderTextColor="#9CA3AF"
            value={localName}
            onChangeText={handleNameChange}
          />
          {localName.length > 0 && (
            <Pressable
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              onPress={clearName}
            >
              <X size={20} color="#6B7280" />
            </Pressable>
          )}
        </View>

        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          Endereço
        </Text>
        <View className="relative mb-6">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-4 pr-10 text-lg text-gray-900 bg-white"
            placeholder="Buscar por endereço..."
            placeholderTextColor="#9CA3AF"
            value={localAddress}
            onChangeText={handleAddressChange}
          />
          {localAddress.length > 0 && (
            <Pressable
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              onPress={clearAddress}
            >
              <X size={20} color="#6B7280" />
            </Pressable>
          )}
        </View>

        <Pressable className="mb-3" onPress={clearAll}>
          <Text className="text-base text-gray-500 text-center">
            Limpar Filtros
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  )
}
