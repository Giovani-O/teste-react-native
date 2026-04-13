import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { EllipsisVertical, PencilLine, Trash } from 'lucide-react-native'
import { School } from '../domain/entities/School'

interface SchoolCardProps {
  school: School
  onEdit: () => void
  onDelete: () => void
}

export function SchoolCard({ school, onEdit, onDelete }: SchoolCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
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
                  onEdit()
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
                  onDelete()
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
  )
}
