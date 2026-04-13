import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Shift } from '../domain/entities/Turma'

const shiftLabels: Record<Shift, string> = {
  morning: 'Manhã',
  afternoon: 'Tarde',
  evening: 'Noite',
}

const shiftClassNames: Record<Shift, string> = {
  morning: 'bg-[#0066CC]',
  afternoon: 'bg-[#7C3AED]',
  evening: 'bg-[#059669]',
}

interface ShiftBadgeProps {
  shift: Shift
}

export function ShiftBadge({ shift }: ShiftBadgeProps) {
  return (
    <View className={`px-2.5 py-1 rounded-xl ${shiftClassNames[shift]}`}>
      <Text className="text-xs font-medium text-white">
        {shiftLabels[shift]}
      </Text>
    </View>
  )
}
