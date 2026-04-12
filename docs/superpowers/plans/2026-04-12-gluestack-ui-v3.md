# Gluestack UI v3 Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install and configure Gluestack UI v3 (with NativeWind) and migrate all existing plain-RN UI components to use Gluestack primitives.

**Architecture:** NativeWind provides Tailwind CSS class-based styling for React Native via Metro + Babel transforms. Gluestack v3 scaffolds its component source code into `src/components/ui/` via the CLI — these are local, copy-pasteable files. The `GluestackUIProvider` wraps the root layout. Each existing component (`BottomSheet`, `ConfirmDialog`, `FAB`, `SchoolListScreen`, `SchoolDetailScreen`) is rewritten to use Gluestack primitives with `className` props instead of `StyleSheet`.

**Tech Stack:** Gluestack UI v3, NativeWind 4.x, Tailwind CSS 3.x, Expo ~54, React Native 0.81.5 (New Arch enabled), Expo Router ~6.

---

## Context & Key Constraints

- `app.json` has `"newArchEnabled": true` — New Architecture is ON. NativeWind 4.x supports New Arch.
- No `babel.config.js` or `metro.config.js` exists yet — they must be created.
- The Gluestack CLI (`npx gluestack-ui init`) requires an active network connection and may prompt interactively. Use `--yes` flag if available, or follow its prompts to select "Expo" template.
- Gluestack v3 scaffolds component files into `src/components/ui/` (or a chosen path). The CLI generates: `GluestackUIProvider`, `Box`, `Text`, `Pressable`, `Button`, `Modal`, `ScrollView`, etc. as local source files.
- After setup, `global.css` must be imported in the root layout (`app/_layout.tsx`).
- The existing `src/components/BottomSheet.tsx`, `ConfirmDialog.tsx`, `FAB.tsx` will be fully replaced.
- The existing screens (`SchoolListScreen.tsx`, `SchoolDetailScreen.tsx`) will have all `StyleSheet` removed and replaced with `className` props.
- UI strings stay in Brazilian Portuguese (pt-BR).

---

## Files Overview

**Created by Gluestack CLI (do not edit manually):**
- `babel.config.js` — NativeWind babel preset
- `metro.config.js` — NativeWind metro wrapper
- `global.css` — Tailwind directives + CSS variables for Gluestack theme
- `tailwind.config.js` — NativeWind preset + content paths
- `src/components/ui/gluestack-ui-provider/index.tsx` — GluestackUIProvider
- `src/components/ui/gluestack-ui-provider/config.ts` — theme tokens
- `src/components/ui/` — scaffolded component files (button, box, text, pressable, modal, etc.)
- `nativewind-env.d.ts` — TypeScript types for className prop

**Modified:**
- `app/_layout.tsx` — wrap with `GluestackUIProvider`, import `global.css`
- `src/components/BottomSheet.tsx` — rewrite using Gluestack Modal + Box + Pressable
- `src/components/ConfirmDialog.tsx` — rewrite using Gluestack Modal + Box + Button
- `src/components/FAB.tsx` — rewrite using Gluestack Pressable + Box
- `src/screens/schools/SchoolListScreen.tsx` — replace StyleSheet with className
- `src/screens/schools/SchoolDetailScreen.tsx` — replace StyleSheet with className

---

## Task 1: Install NativeWind and Tailwind dependencies

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install NativeWind and Tailwind CSS**

```bash
npm install nativewind@^4.1.23
npm install --save-dev tailwindcss@^3.4.17
```

> NativeWind 4.x peer deps: only `tailwindcss >3.3.0`. Tailwind 3.x is required (not v4, which NativeWind does not yet support). Use `tailwindcss@^3.4.17` specifically.

- [ ] **Step 2: Verify installation without errors**

```bash
npm ls nativewind tailwindcss 2>&1 | head -10
```

Expected: both packages listed without `UNMET PEER DEPENDENCY` or `npm ERR!` lines. If there are peer dependency conflicts, run with `--legacy-peer-deps` and note the conflicts for resolution.

---

## Task 2: Run Gluestack UI v3 init

**Files:**
- Creates: `babel.config.js`, `metro.config.js`, `global.css`, `tailwind.config.js`, `nativewind-env.d.ts`, `src/components/ui/gluestack-ui-provider/`, and various component files under `src/components/ui/`

- [ ] **Step 1: Run the Gluestack init CLI**

```bash
npx gluestack-ui@latest init
```

When prompted:
- Project type: **Expo**
- Components directory: `src/components/ui` (or accept the default, which is usually `components/ui` — adjust in Task 3 if needed)
- Accept all other defaults

The CLI will install additional packages (`@gluestack-ui/core`, `@gluestack-ui/utils`, `react-native-svg`, etc.) and generate config files automatically.

- [ ] **Step 2: Verify the generated files exist**

```bash
ls babel.config.js metro.config.js global.css tailwind.config.js nativewind-env.d.ts
ls src/components/ui/gluestack-ui-provider/
```

Expected: all five config files present, and `gluestack-ui-provider/` directory with `index.tsx` and `config.ts` inside.

- [ ] **Step 3: Check babel.config.js contains NativeWind preset**

Open `babel.config.js` and confirm it contains `['babel-preset-expo', { jsxImportSource: 'nativewind' }]` and `'nativewind/babel'` plugin. If not (i.e., CLI generated a minimal config), the file should look like:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    plugins: ['nativewind/babel'],
  };
};
```

Edit if the CLI produced a different structure.

- [ ] **Step 4: Check metro.config.js contains withNativeWind**

Open `metro.config.js` and confirm it wraps the config with `withNativeWind`. If not, it should look like:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

- [ ] **Step 5: Check tailwind.config.js has NativeWind preset and correct content paths**

Open `tailwind.config.js` and confirm it contains the `nativewind/preset` and that `content` includes your source files. It should look like:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/components/ui/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Edit `content` if the CLI generated different paths. The `./src/**/*.{js,jsx,ts,tsx}` entry must cover both screens and components.

- [ ] **Step 6: Check global.css has Tailwind directives**

Open `global.css` and confirm it has:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

The CLI may also add CSS variables for Gluestack theme tokens — leave those as-is.

---

## Task 3: Wire up GluestackUIProvider in root layout

**Files:**
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Read the current `app/_layout.tsx`**

Current content (for reference):

```tsx
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#0066CC',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="schools/index" options={{ title: 'Escolas' }} />
        <Stack.Screen name="schools/[id]" options={{ title: 'Detalhes da Escola' }} />
      </Stack>
    </>
  )
}
```

- [ ] **Step 2: Update `app/_layout.tsx` to add GluestackUIProvider and global.css import**

Replace the entire file with:

```tsx
import '@/global.css'
import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider'
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
        <Stack.Screen name="schools/[id]" options={{ title: 'Detalhes da Escola' }} />
      </Stack>
    </GluestackUIProvider>
  )
}
```

> Note: The `@/` alias resolves to the project root because `tsconfig.json` has `"baseUrl": "."` or a `paths` alias. If `@/` is not configured, use relative paths: `import '../global.css'` and `import '../src/components/ui/gluestack-ui-provider'`.

- [ ] **Step 3: Check tsconfig.json for path aliases**

Open `tsconfig.json` and check if `@/` is configured. If paths aliases are not present, use relative imports in `app/_layout.tsx`:

```tsx
import '../global.css'
import { GluestackUIProvider } from '../src/components/ui/gluestack-ui-provider'
```

---

## Task 4: Scaffold required Gluestack UI components

**Files:**
- Creates: component files under `src/components/ui/` for each added component

- [ ] **Step 1: Add the Box component**

```bash
npx gluestack-ui add box
```

- [ ] **Step 2: Add the Text component**

```bash
npx gluestack-ui add text
```

- [ ] **Step 3: Add the Pressable component**

```bash
npx gluestack-ui add pressable
```

- [ ] **Step 4: Add the Button component**

```bash
npx gluestack-ui add button
```

- [ ] **Step 5: Add the Modal component**

```bash
npx gluestack-ui add modal
```

- [ ] **Step 6: Add the ScrollView component** (if available)

```bash
npx gluestack-ui add scroll-view
```

If this command fails with "component not found", skip it — use the RN `ScrollView` directly since Gluestack may not have a dedicated ScrollView scaffold.

- [ ] **Step 7: Verify all added components exist**

```bash
ls src/components/ui/
```

Expected output includes: `box/`, `text/`, `pressable/`, `button/`, `modal/`, `gluestack-ui-provider/`.

---

## Task 5: Rewrite `FAB` component with Gluestack primitives

**Files:**
- Modify: `src/components/FAB.tsx`

The FAB is the simplest component — a good starting point to verify the Gluestack setup works before touching more complex components.

- [ ] **Step 1: Rewrite `src/components/FAB.tsx`**

Replace the entire file with:

```tsx
import { Pressable } from '@/src/components/ui/pressable'
import { Text } from '@/src/components/ui/text'

interface FABProps {
  onPress: () => void
}

export function FAB({ onPress }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-4 right-4 w-18 h-18 rounded-2xl bg-[#0066CC] items-center justify-center active:opacity-80"
    >
      <Text className="text-white text-5xl leading-8 font-normal">+</Text>
    </Pressable>
  )
}
```

> `w-18` and `h-18` are `72px` (18 × 4). If Tailwind complains about unknown classes, use `w-[72px] h-[72px]` instead.

- [ ] **Step 2: Start the Expo dev server and verify no import errors**

```bash
npx expo start --clear
```

Open on a device or simulator. Navigate to the Schools list screen. Verify:
- The FAB renders (blue circle, `+` icon, bottom-right corner)
- No red error screen or Metro bundler errors in the terminal
- No "Module not found" errors

Stop the server (`Ctrl+C`) after verification.

---

## Task 6: Rewrite `BottomSheet` component with Gluestack primitives

**Files:**
- Modify: `src/components/BottomSheet.tsx`

- [ ] **Step 1: Rewrite `src/components/BottomSheet.tsx`**

Replace the entire file with:

```tsx
import { Modal, ModalBackdrop, ModalContent } from '@/src/components/ui/modal'
import { Pressable } from '@/src/components/ui/pressable'
import { ReactNode } from 'react'
import { View } from 'react-native'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent className="absolute bottom-0 left-0 right-0 m-0 rounded-t-2xl rounded-b-none min-h-[50%] pb-8">
        <Pressable onPress={onClose} className="absolute inset-0" />
        <View className="items-center py-3">
          <View className="w-9 h-1 rounded-full bg-gray-300" />
        </View>
        {children}
      </ModalContent>
    </Modal>
  )
}
```

> Note: Gluestack's `Modal` component uses `ModalBackdrop` for the overlay (it handles fade animation internally) and `ModalContent` for the sheet. The `animationType` defaults to slide for `ModalContent`.

> If Gluestack's Modal scaffold exports different names (check `src/components/ui/modal/index.tsx` after running `npx gluestack-ui add modal`), adjust imports to match actual exports.

- [ ] **Step 2: Verify in the running app**

```bash
npx expo start --clear
```

Open the Schools screen, press the FAB. Verify:
- Bottom sheet slides up from the bottom
- Backdrop fades in (not slides)
- Pressing backdrop closes the sheet
- Handle bar visible at top of sheet
- "Nova Escola" placeholder text visible

Stop the server.

---

## Task 7: Rewrite `ConfirmDialog` component with Gluestack primitives

**Files:**
- Modify: `src/components/ConfirmDialog.tsx`

- [ ] **Step 1: Rewrite `src/components/ConfirmDialog.tsx`**

Replace the entire file with:

```tsx
import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from '@/src/components/ui/modal'
import { Button, ButtonText } from '@/src/components/ui/button'
import { Pressable } from '@/src/components/ui/pressable'
import { Text } from '@/src/components/ui/text'
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
          <Text className="text-base font-semibold text-gray-900 flex-1">{title}</Text>
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
          <Button
            className="flex-1 bg-red-500"
            onPress={onConfirm}
          >
            <ButtonText className="text-white">Excluir</ButtonText>
          </Button>
        </View>
      </ModalContent>
    </Modal>
  )
}
```

---

## Task 8: Rewrite `SchoolListScreen` with Gluestack primitives

**Files:**
- Modify: `src/screens/schools/SchoolListScreen.tsx`

- [ ] **Step 1: Rewrite `src/screens/schools/SchoolListScreen.tsx`**

Replace the entire file with:

```tsx
import { Pressable } from '@/src/components/ui/pressable'
import { Text } from '@/src/components/ui/text'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { BottomSheet } from '../../components/BottomSheet'
import { FAB } from '../../components/FAB'
import { mockSchools } from '../../data/mocks/mockData'
import { School } from '../../domain/entities/School'

export function SchoolListScreen() {
  const router = useRouter()
  const [schools] = useState<School[]>(mockSchools)
  const [createOpen, setCreateOpen] = useState(false)

  const handleSchoolPress = (id: string) => {
    router.push(`/schools/${id}`)
  }

  return (
    <View className="flex-1 bg-white">
      {schools.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-lg text-gray-500 text-center mb-2">
            Nenhuma escola encontrada
          </Text>
          <Text className="text-sm text-gray-400 text-center">
            Toque no botão + para adicionar uma escola
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 border-t border-gray-200" bounces={false}>
          {schools.map((school) => (
            <Pressable
              key={school.id}
              className="px-4 py-3.5 border-b border-gray-200 bg-white active:bg-gray-50"
              onPress={() => handleSchoolPress(school.id)}
            >
              <Text className="text-base font-semibold text-gray-900 mb-0.5">
                {school.name}
              </Text>
              <Text className="text-sm text-gray-500 mb-1">{school.address}</Text>
              <Text className="text-xs text-gray-400">
                {school.classCount}{' '}
                {school.classCount === 1 ? 'turma' : 'turmas'}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <FAB onPress={() => setCreateOpen(true)} />

      <BottomSheet isOpen={createOpen} onClose={() => setCreateOpen(false)}>
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">Nova Escola</Text>
          <Text className="text-sm text-gray-500">Em construção...</Text>
        </View>
      </BottomSheet>
    </View>
  )
}
```

---

## Task 9: Rewrite `SchoolDetailScreen` with Gluestack primitives

**Files:**
- Modify: `src/screens/schools/SchoolDetailScreen.tsx`

- [ ] **Step 1: Rewrite `src/screens/schools/SchoolDetailScreen.tsx`**

Replace the entire file with:

```tsx
import { Text } from '@/src/components/ui/text'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { BottomSheet } from '../../components/BottomSheet'
import { FAB } from '../../components/FAB'
import { mockSchools, mockTurmas } from '../../data/mocks/mockData'
import { School } from '../../domain/entities/School'
import { Shift, Turma } from '../../domain/entities/Turma'

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

export function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [school, setSchool] = useState<School | null>(null)
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    const found = mockSchools.find((s) => s.id === id)
    setSchool(found ?? null)
    setTurmas(mockTurmas[id as string] ?? [])
  }, [id])

  if (!school) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-500">Escola não encontrada</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900 mb-1">{school.name}</Text>
        <Text className="text-sm text-gray-500 mb-2">{school.address}</Text>
        <Text className="text-xs text-gray-400">
          {school.classCount}{' '}
          {school.classCount === 1 ? 'turma cadastrada' : 'turmas cadastradas'}
        </Text>
      </View>

      <Text className="text-base font-semibold text-gray-900 px-4 pt-4 pb-2 border-t border-gray-200">
        Turmas
      </Text>

      {turmas.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-base text-gray-500 text-center mb-2">
            Nenhuma turma encontrada
          </Text>
          <Text className="text-sm text-gray-400 text-center">
            Toque no botão + para adicionar uma turma
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1" bounces={false}>
          {turmas.map((turma) => (
            <View
              key={turma.id}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-gray-200 bg-white"
            >
              <View className="flex-1">
                <Text className="text-[15px] font-medium text-gray-900 mb-0.5">
                  {turma.name}
                </Text>
                <Text className="text-[13px] text-gray-500">{turma.academicYear}</Text>
              </View>
              <View
                className={`px-2.5 py-1 rounded-xl ml-3 ${shiftClassNames[turma.shift]}`}
              >
                <Text className="text-xs font-medium text-white">
                  {shiftLabels[turma.shift]}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <FAB onPress={() => setCreateOpen(true)} />

      <BottomSheet isOpen={createOpen} onClose={() => setCreateOpen(false)}>
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">Nova Turma</Text>
          <Text className="text-sm text-gray-500">Em construção...</Text>
        </View>
      </BottomSheet>
    </View>
  )
}
```

---

## Task 10: Final verification

- [ ] **Step 1: Clear cache and start the dev server**

```bash
npx expo start --clear
```

- [ ] **Step 2: Verify Schools list screen**

- Schools list renders with card rows
- FAB visible bottom-right (blue circle, `+`)
- Tapping FAB opens bottom sheet ("Nova Escola" placeholder)
- Tapping backdrop closes sheet
- Tapping a school row navigates to detail screen

- [ ] **Step 3: Verify School detail screen**

- School name, address, and class count visible in header
- "Turmas" section label visible
- Turma rows render with colored shift badges (Manhã=blue, Tarde=purple, Noite=green)
- FAB visible bottom-right
- Tapping FAB opens bottom sheet ("Nova Turma" placeholder)

- [ ] **Step 4: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1
```

Expected: no errors (or only pre-existing errors unrelated to this migration).

---

## Troubleshooting

**"Module not found: @/src/components/ui/..."**
→ The `@/` alias may not be set up in `tsconfig.json`. Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```
Or switch all imports to relative paths (`../../components/ui/...`).

**"className is not a valid prop"**
→ `nativewind-env.d.ts` is missing or not referenced. Check that `tsconfig.json` includes it via `include` or `types`. The file should contain:
```ts
/// <reference types="nativewind/types" />
```

**"Cannot find module 'nativewind/metro'"**
→ NativeWind was not installed. Run `npm install nativewind@^4.1.23` again.

**Gluestack Modal component exports different names**
→ Open `src/components/ui/modal/index.tsx` and check what is exported. Adjust imports in `BottomSheet.tsx` and `ConfirmDialog.tsx` to match.

**`npx gluestack-ui add box` — "command not found" or CLI errors**
→ The Gluestack CLI requires the project to be initialized first (`npx gluestack-ui init`). Re-run init if add commands fail.
