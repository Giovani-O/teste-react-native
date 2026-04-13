import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import '@/global.css'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'

async function enableMocking() {
  if (!__DEV__) {
    return
  }
  const { startMirageServer } = await import('../src/data/mocks/mirageServer')
  startMirageServer()
  const { installFetchXhrShim } = await import('../src/data/mocks/fetchXhrShim')
  installFetchXhrShim()
}

export default function RootLayout() {
  const [mockingReady, setMockingReady] = useState(!__DEV__)

  useEffect(() => {
    if (!__DEV__) return
    enableMocking()
      .then(() => setMockingReady(true))
      .catch((error) => {
        console.error('Failed to initialize mocking:', error)
        setMockingReady(true)
      })
  }, [])

  if (!mockingReady) return null

  return (
    <GluestackUIProvider mode="light">
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#0066CC',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="schools/index" options={{ title: 'Escolas' }} />
        <Stack.Screen
          name="schools/[id]"
          options={{ title: 'Detalhes da Escola' }}
        />
      </Stack>
    </GluestackUIProvider>
  )
}
