import { View } from 'react-native'
import { Text } from '@/components/ui/text'

interface EmptyStateProps {
  title: string
  subtitle: string
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8">
      <Text className="text-lg text-gray-500 text-center mb-2">{title}</Text>
      <Text className="text-sm text-gray-400 text-center">{subtitle}</Text>
    </View>
  )
}
