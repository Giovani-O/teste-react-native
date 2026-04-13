import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { EllipsisVertical, PencilLine, Trash } from 'lucide-react-native'
import { Turma } from '../domain/entities/Turma'
import { ShiftBadge } from './ShiftBadge'

interface TurmaListItemProps {
  turma: Turma
  onEdit: (turma: Turma) => void
  onDelete: (turma: Turma) => void
}

export function TurmaListItem({ turma, onEdit, onDelete }: TurmaListItemProps) {
  const [selected, setSelected] = useState(false)

  return (
    <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-gray-200 bg-white">
      <View className="flex-1">
        <Text className="text-[15px] font-medium text-gray-900 mb-0.5">
          {turma.name}
        </Text>
        <Text className="text-[13px] text-gray-500">{turma.academicYear}</Text>
      </View>
      <View className="flex-row items-center">
        <ShiftBadge shift={turma.shift} />
        <View className="relative ml-2">
          <Pressable
            className="p-2 -m-1"
            onPress={() => setSelected(!selected)}
            accessibilityLabel="Mais opções"
            accessibilityRole="button"
          >
            <EllipsisVertical size={20} color="#6B7280" />
          </Pressable>
          {selected && (
            <View className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <Pressable
                className="flex-row items-center px-4 py-3 border-b border-gray-100"
                onPress={() => {
                  onEdit(turma)
                  setSelected(false)
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
                  onDelete(turma)
                  setSelected(false)
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
  )
}
