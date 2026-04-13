import { ReactNode } from 'react'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

interface FABProps {
  label: string
  onPress: () => void
  icon?: ReactNode
  badge?: number
  backgroundColor?: string
  position?: 'left' | 'right'
}

export function FAB({
  label,
  onPress,
  icon,
  badge,
  backgroundColor = '#0066CC',
  position = 'right',
}: FABProps) {
  const positionClass =
    position === 'left' ? 'bottom-4 left-4' : 'bottom-4 right-4'

  return (
    <View className={`absolute ${positionClass}`}>
      <Pressable
        onPress={onPress}
        className="w-[80px] h-[80px] rounded-3xl items-center justify-center active:opacity-80"
        style={{ backgroundColor }}
        accessibilityRole="button"
        accessibilityLabel={`${label}`}
      >
        {icon || (
          <Text className="text-white text-4xl leading-9 font-normal">+</Text>
        )}
      </Pressable>
      {badge !== undefined && badge > 0 && (
        <View className="absolute -top-1 -right-1 min-w-[20px] h-[20px] rounded-full bg-red-500 items-center justify-center px-1">
          <Text className="text-white text-xs font-bold">
            {badge > 3 ? '3+' : badge}
          </Text>
        </View>
      )}
    </View>
  )
}
