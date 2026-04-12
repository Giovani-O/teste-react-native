import { ReactNode } from 'react'
import { View } from 'react-native'
import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop onPress={onClose} />
      <ModalContent className="absolute bottom-0 left-0 right-0 m-0 rounded-t-2xl rounded-b-none min-h-[50%] pb-8 p-0">
        <View className="items-center py-3">
          <View className="w-9 h-1 rounded-full bg-gray-300" />
        </View>
        {children}
      </ModalContent>
    </Modal>
  )
}
