import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal'
import { Button, ButtonText } from '@/components/ui/button'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="rounded-xl mx-6">
        <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <Text className="text-base font-semibold text-gray-900 flex-1">
            {title}
          </Text>
          <Pressable onPress={onClose} className="p-1 ml-2">
            <Text className="text-base text-gray-500">✕</Text>
          </Pressable>
        </View>
        <View className="px-4 pb-4">
          <Text className="text-sm text-gray-700 leading-5">{message}</Text>
        </View>
        <View className="flex-row gap-2 px-4 pb-4">
          <Button
            variant="outline"
            className="flex-1 border-gray-300"
            onPress={onClose}
          >
            <ButtonText className="text-gray-700">Cancelar</ButtonText>
          </Button>
          <Button className="flex-1 bg-red-500" onPress={onConfirm}>
            <ButtonText className="text-white">Excluir</ButtonText>
          </Button>
        </View>
      </ModalContent>
    </Modal>
  )
}
