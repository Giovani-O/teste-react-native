import { useEffect, useRef, ReactNode } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onOpen?: () => void
  children: ReactNode
}

export function BottomSheet({
  isOpen,
  onClose,
  onOpen,
  children,
}: BottomSheetProps) {
  const prevOpen = useRef(isOpen)
  useEffect(() => {
    if (isOpen && !prevOpen.current && onOpen) {
      onOpen()
    }
    prevOpen.current = isOpen
  }, [isOpen, onOpen])

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ width: '100%' }}
      >
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {children}
        </ActionsheetContent>
      </KeyboardAvoidingView>
    </Actionsheet>
  )
}
