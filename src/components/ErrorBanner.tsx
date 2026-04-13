import { View } from 'react-native'
import { Text } from '@/components/ui/text'

interface ErrorBannerProps {
  message: string | null
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null

  return (
    <View className="p-4 bg-red-50 border-b border-red-200">
      <Text className="text-sm text-red-700">{message}</Text>
    </View>
  )
}
