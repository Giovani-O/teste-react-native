import { X } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { BottomSheet } from './BottomSheet'
import { Shift } from '../domain/entities/Turma'

interface Filters {
  name: string
  shift: Shift | ''
  academicYear: string
}

interface TurmaFilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const shiftOptions: { value: Shift | ''; label: string }[] = [
  { value: '', label: 'Todos os turnos' },
  { value: 'morning', label: 'Manhã' },
  { value: 'afternoon', label: 'Tarde' },
  { value: 'evening', label: 'Noite' },
]

export function TurmaFilterBottomSheet({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: TurmaFilterBottomSheetProps) {
  const [localName, setLocalName] = useState(filters.name)
  const [localShift, setLocalShift] = useState<Shift | ''>(filters.shift)
  const [localAcademicYear, setLocalAcademicYear] = useState(
    filters.academicYear,
  )

  const handleOpen = () => {
    setLocalName(filters.name)
    setLocalShift(filters.shift)
    setLocalAcademicYear(filters.academicYear)
  }

  const handleNameChange = (value: string) => {
    setLocalName(value)
    onFiltersChange({
      name: value,
      shift: localShift,
      academicYear: localAcademicYear,
    })
  }

  const handleShiftChange = (value: Shift | '') => {
    setLocalShift(value)
    onFiltersChange({
      name: localName,
      shift: value,
      academicYear: localAcademicYear,
    })
  }

  const handleAcademicYearChange = (value: string) => {
    setLocalAcademicYear(value)
    onFiltersChange({ name: localName, shift: localShift, academicYear: value })
  }

  const clearName = () => {
    setLocalName('')
    onFiltersChange({
      name: '',
      shift: localShift,
      academicYear: localAcademicYear,
    })
  }

  const clearShift = () => {
    setLocalShift('')
    onFiltersChange({
      name: localName,
      shift: '',
      academicYear: localAcademicYear,
    })
  }

  const clearAcademicYear = () => {
    setLocalAcademicYear('')
    onFiltersChange({ name: localName, shift: localShift, academicYear: '' })
  }

  const clearAll = () => {
    setLocalName('')
    setLocalShift('')
    setLocalAcademicYear('')
    onFiltersChange({ name: '', shift: '', academicYear: '' })
  }

  const handleClose = () => {
    setLocalName(filters.name)
    setLocalShift(filters.shift)
    setLocalAcademicYear(filters.academicYear)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} onOpen={handleOpen}>
      <View className="p-4 w-full">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Filtrar Turmas
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

        <Text className="text-sm font-medium text-gray-700 mb-1.5">Turno</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {shiftOptions.map((option) => (
            <Pressable
              key={option.value}
              className={`px-4 py-2 rounded-full border ${
                localShift === option.value
                  ? 'bg-gray-800 border-gray-800'
                  : 'bg-white border-gray-300'
              }`}
              onPress={() => handleShiftChange(option.value)}
            >
              <Text
                className={`text-sm font-medium ${
                  localShift === option.value ? 'text-white' : 'text-gray-700'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          Ano Letivo
        </Text>
        <View className="relative mb-6">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-4 pr-10 text-lg text-gray-900 bg-white"
            placeholder="Buscar por ano..."
            placeholderTextColor="#9CA3AF"
            value={localAcademicYear}
            onChangeText={handleAcademicYearChange}
            keyboardType="numeric"
          />
          {localAcademicYear.length > 0 && (
            <Pressable
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              onPress={clearAcademicYear}
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
