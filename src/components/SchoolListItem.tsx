import { Pressable } from 'react-native'
import { Text } from '@/components/ui/text'
import { School } from '../domain/entities/School'

interface SchoolListItemProps {
  school: School
  onPress: (id: string) => void
}

export function SchoolListItem({ school, onPress }: SchoolListItemProps) {
  return (
    <Pressable
      className="px-4 py-5 border-b border-gray-200 bg-white active:bg-gray-50 min-h-[88px]"
      onPress={() => onPress(school.id)}
    >
      <Text className="text-base font-semibold text-gray-900 mb-0.5">
        {school.name}
      </Text>
      <Text className="text-sm text-gray-500 mb-1">{school.address}</Text>
      <Text className="text-xs text-gray-400">
        {school.classCount} {school.classCount === 1 ? 'turma' : 'turmas'}
      </Text>
    </Pressable>
  )
}
