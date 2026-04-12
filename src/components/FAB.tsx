import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'

interface FABProps {
  onPress: () => void
}

export function FAB({ onPress }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-4 right-4 w-[72px] h-[72px] rounded-2xl bg-[#0066CC] items-center justify-center active:opacity-80"
    >
      <Text className="text-white text-3xl leading-9 font-normal">+</Text>
    </Pressable>
  )
}
