import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import '@/global.css'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
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
