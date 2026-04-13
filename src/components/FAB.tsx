import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'

interface FABProps {
  label: string
  onPress: () => void
}

export function FAB({ label, onPress }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-4 right-4 w-[80px] h-[80px] rounded-3xl bg-[#0066CC] items-center justify-center active:opacity-80"
      accessibilityRole="button"
      accessibilityLabel={`${label}`}
    >
      <Text className="text-white text-4xl leading-9 font-normal">+</Text>
    </Pressable>
  )
}
