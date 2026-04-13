import { useEffect, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { ChevronDown, ChevronUp } from 'lucide-react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Turma, Shift } from '../domain/entities/Turma'
import { BottomSheet } from './BottomSheet'

interface TurmaFormData {
  name: string
  shift: Shift
  academicYear: number
}

interface TurmaFormBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: TurmaFormData) => Promise<void>
  initialValues?: Turma
  isLoading?: boolean
}

const shifts: { value: Shift; label: string }[] = [
  { value: 'morning', label: 'Manhã' },
  { value: 'afternoon', label: 'Tarde' },
  { value: 'evening', label: 'Noite' },
]

export function TurmaFormBottomSheet({
  isOpen,
  onClose,
  onSave,
  initialValues,
  isLoading,
}: TurmaFormBottomSheetProps) {
  const [name, setName] = useState('')
  const [shift, setShift] = useState<Shift>('morning')
  const [academicYear, setAcademicYear] = useState('')
  const [shiftDropdownOpen, setShiftDropdownOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setName(initialValues?.name ?? '')
      setShift(initialValues?.shift ?? 'morning')
      setAcademicYear(initialValues?.academicYear?.toString() ?? '')
      setShiftDropdownOpen(false)
    }
  }, [
    isOpen,
    initialValues?.name,
    initialValues?.shift,
    initialValues?.academicYear,
  ])

  const isEditing = !!initialValues
  const canSave = name.trim() && academicYear.trim() && !isLoading

  const handleSave = async () => {
    if (!canSave) return
    await onSave({
      name: name.trim(),
      shift,
      academicYear: parseInt(academicYear, 10),
    })
    if (!isEditing) {
      setName('')
      setShift('morning')
      setAcademicYear('')
    }
    onClose()
  }

  const handleClose = () => {
    setName(initialValues?.name ?? '')
    setShift(initialValues?.shift ?? 'morning')
    setAcademicYear(initialValues?.academicYear?.toString() ?? '')
    setShiftDropdownOpen(false)
    onClose()
  }

  const handleAcademicYearChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, '')
    setAcademicYear(sanitized)
  }

  const selectedShiftLabel = shifts.find((s) => s.value === shift)?.label ?? ''

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <View className="p-4 w-full">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          {isEditing ? 'Editar Turma' : 'Nova Turma'}
        </Text>

        <Text className="text-sm font-medium text-gray-700 mb-1.5">Nome</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-4 mb-4 text-lg text-gray-900 bg-white"
          placeholder="Nome da turma"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-sm font-medium text-gray-700 mb-1.5">Turno</Text>
        <View className="relative mb-4">
          <Pressable
            className="border border-gray-300 rounded-lg px-4 py-4 bg-white flex-row items-center justify-between"
            onPress={() => setShiftDropdownOpen(!shiftDropdownOpen)}
          >
            <Text className="text-lg text-gray-900">{selectedShiftLabel}</Text>
            {shiftDropdownOpen ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </Pressable>
          {shiftDropdownOpen && (
            <View className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              {shifts.map((s) => (
                <Pressable
                  key={s.value}
                  className={`px-4 py-3.5 border-b border-gray-100 last:border-b-0 ${
                    shift === s.value ? 'bg-gray-100' : ''
                  }`}
                  onPress={() => {
                    setShift(s.value)
                    setShiftDropdownOpen(false)
                  }}
                >
                  <Text
                    className={`text-lg ${
                      shift === s.value
                        ? 'text-gray-900 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {s.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          Ano Letivo
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-4 mb-6 text-lg text-gray-900 bg-white"
          placeholder="Ex: 2024"
          placeholderTextColor="#9CA3AF"
          value={academicYear}
          onChangeText={handleAcademicYearChange}
          keyboardType="number-pad"
          maxLength={4}
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
