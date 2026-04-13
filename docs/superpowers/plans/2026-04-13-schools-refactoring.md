# Schools Screen Refactoring Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor SchoolListScreen and SchoolDetailScreen into smaller reusable components and extract filtering logic into custom hooks

**Architecture:** Extract UI components (SchoolListItem, SchoolCard, TurmaListItem) and custom hooks (useSchoolFilter, useTurmaFilter) following composition pattern

**Tech Stack:** React Native, TypeScript, Zustand

---

### Task 1: Create useSchoolFilter hook

**Files:**
- Create: `src/hooks/useSchoolFilter.ts`

- [ ] **Step 1: Write the hook implementation**

```typescript
import { useMemo, useState } from 'react'
import { School } from '../domain/entities/School'

interface SchoolFilters {
  name: string
  address: string
}

export function useSchoolFilter(schools: School[]) {
  const [filters, setFilters] = useState<SchoolFilters>({ name: '', address: '' })

  const filteredSchools = useMemo(() => {
    const nameLower = filters.name.toLowerCase()
    const addressLower = filters.address.toLowerCase()

    return schools.filter((school) => {
      const matchesName =
        !filters.name || school.name.toLowerCase().includes(nameLower)
      const matchesAddress =
        !filters.address || school.address.toLowerCase().includes(addressLower)
      return matchesName && matchesAddress
    })
  }, [schools, filters])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.name) count++
    if (filters.address) count++
    return count
  }, [filters])

  return {
    filters,
    setFilters,
    filteredSchools,
    activeFilterCount,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useSchoolFilter.ts
git commit -m "feat: add useSchoolFilter hook"
```
---

### Task 2: Create useTurmaFilter hook

**Files:**
- Create: `src/hooks/useTurmaFilter.ts`

- [ ] **Step 1: Write the hook implementation**

```typescript
import { useMemo, useState } from 'react'
import { Shift } from '../domain/entities/Turma'

interface TurmaFilters {
  name: string
  shift: Shift | ''
  academicYear: string
}

export function useTurmaFilter(turmas: any[]) {
  const [filters, setFilters] = useState<TurmaFilters>({
    name: '',
    shift: '',
    academicYear: '',
  })

  const filteredTurmas = useMemo(() => {
    return turmas.filter((turma) => {
      const matchesName =
        !filters.name ||
        turma.name.toLowerCase().includes(filters.name.toLowerCase())
      const matchesShift =
        !filters.shift || turma.shift === filters.shift
      const matchesYear =
        !filters.academicYear ||
        turma.academicYear.toString().includes(filters.academicYear)
      return matchesName && matchesShift && matchesYear
    })
  }, [turmas, filters])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.name) count++
    if (filters.shift) count++
    if (filters.academicYear) count++
    return count
  }, [filters])

  return {
    filters,
    setFilters,
    filteredTurmas,
    activeFilterCount,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useTurmaFilter.ts
git commit -m "feat: add useTurmaFilter hook"
```
---

### Task 3: Create SchoolListItem component

**Files:**
- Create: `src/components/SchoolListItem.tsx`

- [ ] **Step 1: Write the component**

```typescript
import { Pressable, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { School } from '../domain/entities/School'

interface SchoolListItemProps {
  school: School
  onPress: (id: string) => void
}

export function SchoolListItem({ school, onPress }: SchoolListItemProps) {
  return (
    <Pressable
      className="px-4 py-5 border-b border-gray-200 bg-white active:bg-gray-50 min-h-[88px]"
      onPress={() => onPress(school.id)}
    >
      <Text className="text-base font-semibold text-gray-900 mb-0.5">
        {school.name}
      </Text>
      <Text className="text-sm text-gray-500 mb-1">{school.address}</Text>
      <Text className="text-xs text-gray-400">
        {school.classCount} {school.classCount === 1 ? 'turma' : 'turmas'}
      </Text>
    </Pressable>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SchoolListItem.tsx
git commit -m "feat: add SchoolListItem component"
```
---

### Task 4: Create EmptyState component

**Files:**
- Create: `src/components/EmptyState.tsx`

- [ ] **Step 1: Write the component**

```typescript
import { View } from 'react-native'
import { Text } from '@/components/ui/text'

interface EmptyStateProps {
  title: string
  subtitle: string
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8">
      <Text className="text-lg text-gray-500 text-center mb-2">{title}</Text>
      <Text className="text-sm text-gray-400 text-center">{subtitle}</Text>
    </View>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EmptyState.tsx
git commit -m "feat: add EmptyState component"
```
---

### Task 5: Create ErrorBanner component

**Files:**
- Create: `src/components/ErrorBanner.tsx`

- [ ] **Step 1: Write the component**

```typescript
import { View } from 'react-native'
import { Text } from '@/components/ui/text'

interface ErrorBannerProps {
  message: string | null
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null

  return (
    <View className="p-4 bg-red-50 border-b border-red-200">
      <Text className="text-sm text-red-700">{message}</Text>
    </View>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ErrorBanner.tsx
git commit -m "feat: add ErrorBanner component"
```
---

### Task 6: Create SchoolCard component

**Files:**
- Create: `src/components/SchoolCard.tsx`

- [ ] **Step 1: Write the component**

```typescript
import { Pressable, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { EllipsisVertical, PencilLine, Trash } from 'lucide-react-native'
import { School } from '../domain/entities/School'
import { useState } from 'react'

interface SchoolCardProps {
  school: School
  onEdit: () => void
  onDelete: () => void
}

export function SchoolCard({ school, onEdit, onDelete }: SchoolCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <View className="p-4 border-b border-gray-200">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {school.name}
          </Text>
          <Text className="text-sm text-gray-500 mb-2">{school.address}</Text>
          <Text className="text-xs text-gray-400">
            {school.classCount}{' '}
            {school.classCount === 1 ? 'turma cadastrada' : 'turmas cadastradas'}
          </Text>
        </View>
        <View className="relative">
          <Pressable
            className="p-3 -m-1"
            onPress={() => setMenuOpen(!menuOpen)}
            accessibilityLabel="Mais opções"
            accessibilityRole="button"
          >
            <EllipsisVertical size={24} color="#6B7280" />
          </Pressable>
          {menuOpen && (
            <View className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <Pressable
                className="flex-row items-center px-4 py-3.5 border-b border-gray-100"
                onPress={() => {
                  setMenuOpen(false)
                  onEdit()
                }}
              >
                <PencilLine size={20} color="#374151" />
                <Text className="text-gray-700 ml-3 text-[15px]">
                  Editar escola
                </Text>
              </Pressable>
              <Pressable
                className="flex-row items-center px-4 py-3.5"
                onPress={() => {
                  setMenuOpen(false)
                  onDelete()
                }}
              >
                <Trash size={20} color="#DC2626" />
                <Text className="text-red-600 ml-3 text-[15px]">
                  Excluir escola
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SchoolCard.tsx
git commit -m "feat: add SchoolCard component"
```
---

### Task 7: Create ShiftBadge component

**Files:**
- Create: `src/components/ShiftBadge.tsx`

- [ ] **Step 1: Write the component**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ShiftBadge.tsx
git commit -m "feat: add ShiftBadge component"
```
---

### Task 8: Create TurmaListItem component

**Files:**
- Create: `src/components/TurmaListItem.tsx`

- [ ] **Step 1: Write the component**

```typescript
import { Pressable, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { EllipsisVertical, PencilLine, Trash } from 'lucide-react-native'
import { Turma } from '../domain/entities/Turma'
import { ShiftBadge } from './ShiftBadge'
import { useState } from 'react'

interface TurmaListItemProps {
  turma: Turma
  onEdit: (turma: Turma) => void
  onDelete: (turma: Turma) => void
}

export function TurmaListItem({ turma, onEdit, onDelete }: TurmaListItemProps) {
  const [selected, setSelected] = useState(false)

  return (
    <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-gray-200 bg-white">
      <View className="flex-1">
        <Text className="text-[15px] font-medium text-gray-900 mb-0.5">
          {turma.name}
        </Text>
        <Text className="text-[13px] text-gray-500">{turma.academicYear}</Text>
      </View>
      <View className="flex-row items-center">
        <ShiftBadge shift={turma.shift} />
        <View className="relative ml-2">
          <Pressable
            className="p-2 -m-1"
            onPress={() => setSelected(!selected)}
            accessibilityLabel="Mais opções"
            accessibilityRole="button"
          >
            <EllipsisVertical size={20} color="#6B7280" />
          </Pressable>
          {selected && (
            <View className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <Pressable
                className="flex-row items-center px-4 py-3 border-b border-gray-100"
                onPress={() => {
                  onEdit(turma)
                  setSelected(false)
                }}
              >
                <PencilLine size={18} color="#374151" />
                <Text className="text-gray-700 ml-2.5 text-[14px]">
                  Editar turma
                </Text>
              </Pressable>
              <Pressable
                className="flex-row items-center px-4 py-3"
                onPress={() => {
                  onDelete(turma)
                  setSelected(false)
                }}
              >
                <Trash size={18} color="#DC2626" />
                <Text className="text-red-600 ml-2.5 text-[14px]">
                  Excluir turma
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TurmaListItem.tsx
git commit -m "feat: add TurmaListItem component"
```
---

### Task 9: Refactor SchoolListScreen to use extracted components/hooks

**Files:**
- Modify: `src/screens/schools/SchoolListScreen.tsx`

- [ ] **Step 1: Update imports and component**

```typescript
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Plus, Search } from 'lucide-react-native'
import { FAB } from '../../components/FAB'
import { SchoolFormBottomSheet } from '../../components/SchoolFormBottomSheet'
import { FilterBottomSheet } from '../../components/FilterBottomSheet'
import { useSchoolsStore } from '../../store/schools.store'
import { useSchoolFilter } from '../../hooks/useSchoolFilter'
import { SchoolListItem } from '../../components/SchoolListItem'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'

export function SchoolListScreen() {
  const router = useRouter()
  const { schools, fetchSchools, createSchool, isLoading, error } =
    useSchoolsStore()
  const [createOpen, setCreateOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const { filters, setFilters, filteredSchools, activeFilterCount } =
    useSchoolFilter(schools)

  useEffect(() => {
    fetchSchools()
  }, [fetchSchools])

  const handleCreate = async (data: { name: string; address: string }) => {
    await createSchool(data)
    setCreateOpen(false)
  }

  const handleSchoolPress = (id: string) => {
    router.push(`/schools/${id}`)
  }

  return (
    <View className="flex-1 bg-white">
      <ErrorBanner message={error} />
      {filteredSchools.length === 0 ? (
        <EmptyState
          title={
            schools.length === 0
              ? 'Nenhuma escola encontrada'
              : 'Nenhuma escola atende ao filtro'
          }
          subtitle={
            schools.length === 0
              ? 'Toque no botão + para adicionar uma escola'
              : 'Tente ajustar os filtros'
          }
        />
      ) : (
        <ScrollView className="flex-1 border-t border-gray-200" bounces={false}>
          {filteredSchools.map((school) => (
            <SchoolListItem
              key={school.id}
              school={school}
              onPress={handleSchoolPress}
            />
          ))}
        </ScrollView>
      )}

      <FAB
        label="Filtrar escolas"
        onPress={() => setFilterOpen(true)}
        icon={<Search size={32} color="white" />}
        badge={activeFilterCount}
        backgroundColor="#6B7280"
        position="left"
      />

      <FAB
        label="Adicionar escola"
        onPress={() => setCreateOpen(true)}
        icon={<Plus size={32} color="white" />}
        position="right"
      />

      <SchoolFormBottomSheet
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
        isLoading={isLoading}
      />

      <FilterBottomSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </View>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/schools/SchoolListScreen.tsx
git commit -m "refactor: use extracted hooks and components in SchoolListScreen"
```
---

### Task 10: Refactor SchoolDetailScreen to use extracted components/hooks

**Files:**
- Modify: `src/screens/schools/SchoolDetailScreen.tsx`

- [ ] **Step 1: Update imports and component**

```typescript
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { Plus, Search } from 'lucide-react-native'
import { Text } from '@/components/ui/text'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { FAB } from '../../components/FAB'
import { SchoolFormBottomSheet } from '../../components/SchoolFormBottomSheet'
import { TurmaFilterBottomSheet } from '../../components/TurmaFilterBottomSheet'
import { TurmaFormBottomSheet } from '../../components/TurmaFormBottomSheet'
import { Shift, Turma } from '../../domain/entities/Turma'
import { useSchoolsStore } from '../../store/schools.store'
import { useTurmasStore } from '../../store/turmas.store'
import { useTurmaFilter } from '../../hooks/useTurmaFilter'
import { SchoolCard } from '../../components/SchoolCard'
import { EmptyState } from '../../components/EmptyState'
import { TurmaListItem } from '../../components/TurmaListItem'

export function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()

  const {
    updateSchool,
    deleteSchool,
    incrementClassCount,
    decrementClassCount,
    isLoading: schoolLoading,
  } = useSchoolsStore()
  const {
    turmas,
    isLoading,
    fetchTurmasBySchool,
    deleteTurmaBySchoolId,
    createTurma,
    updateTurma,
    deleteTurma,
  } = useTurmasStore()

  const school = useSchoolsStore((state) =>
    state.schools.find((s) => s.id === id),
  )

  const [editingTurma, setEditingTurma] = useState<Turma | null>(null)
  const [editTurmaOpen, setEditTurmaOpen] = useState(false)
  const [deleteTurmaOpen, setDeleteTurmaOpen] = useState(false)
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null)
  const [turmaFilterOpen, setTurmaFilterOpen] = useState(false)

  const { filters: turmaFilters, setFilters: setTurmaFilters, filteredTurmas, activeFilterCount } = useTurmaFilter(turmas)

  useEffect(() => {
    if (id) {
      fetchTurmasBySchool(id)
    }
  }, [id, fetchTurmasBySchool])

  const handleEdit = async (data: { name: string; address: string }) => {
    if (!id) return
    await updateSchool(id, data)
    setEditOpen(false)
  }

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await deleteTurmaBySchoolId(id)
      await deleteSchool(id)
      setDeleteOpen(false)
      router.back()
    } catch (error) {
      console.error('Failed to delete school:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCreateTurma = async (data: {
    name: string
    shift: Shift
    academicYear: number
  }) => {
    if (!id) return
    const previousTurmasCount = useTurmasStore.getState().turmas.length
    await createTurma({ ...data, schoolId: id })
    const { error: createTurmaError, turmas: updatedTurmas } =
      useTurmasStore.getState()
    if (!createTurmaError && updatedTurmas.length > previousTurmasCount) {
      incrementClassCount(id, 1)
      setCreateOpen(false)
    }
  }

  if (!school) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-500">Escola não encontrada</Text>
      </View>
    )
  }

  const handleEditTurma = async (data: {
    name: string
    shift: Shift
    academicYear: number
  }) => {
    if (!editingTurma?.id) return
    await updateTurma(editingTurma.id, data)
    setEditTurmaOpen(false)
    setEditingTurma(null)
  }

  const handleDeleteTurma = async () => {
    if (!selectedTurma?.id || !id) return
    const turmaId = selectedTurma.id
    const turmaExistedBeforeDelete = useTurmasStore
      .getState()
      .turmas.some((turma) => turma.id === turmaId)
    await deleteTurma(turmaId)
    const turmaStillExists = useTurmasStore
      .getState()
      .turmas.some((turma) => turma.id === turmaId)
    if (turmaExistedBeforeDelete && !turmaStillExists) {
      decrementClassCount(id, 1)
      setDeleteTurmaOpen(false)
      setSelectedTurma(null)
    }
  }

  return (
    <View className="flex-1 bg-white">
      <SchoolCard
        school={school}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

      <Text className="text-base font-semibold text-gray-900 px-4 pt-4 pb-2 border-t border-gray-200">
        Turmas
      </Text>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator />
        </View>
      ) : filteredTurmas.length === 0 ? (
        <EmptyState
          title={
            turmas.length === 0
              ? 'Nenhuma turma encontrada'
              : 'Nenhuma turma atende ao filtro'
          }
          subtitle={
            turmas.length === 0
              ? 'Toque no botão + para adicionar uma turma'
              : 'Tente ajustar os filtros'
          }
        />
      ) : (
        <ScrollView className="flex-1" bounces={false}>
          {filteredTurmas.map((turma) => (
            <TurmaListItem
              key={turma.id}
              turma={turma}
              onEdit={(t) => {
                setEditingTurma(t)
                setEditTurmaOpen(true)
              }}
              onDelete={(t) => {
                setSelectedTurma(t)
                setDeleteTurmaOpen(true)
              }}
            />
          ))}
        </ScrollView>
      )}

      <FAB
        label="Filtrar turmas"
        onPress={() => setTurmaFilterOpen(true)}
        icon={<Search size={32} color="white" />}
        badge={activeFilterCount}
        backgroundColor="#6B7280"
        position="left"
      />

      <FAB
        label="Adicionar turma"
        onPress={() => setCreateOpen(true)}
        icon={<Plus size={32} color="white" />}
      />

      <TurmaFormBottomSheet
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreateTurma}
      />

      <TurmaFormBottomSheet
        isOpen={editTurmaOpen}
        onClose={() => {
          setEditTurmaOpen(false)
          setEditingTurma(null)
        }}
        onSave={handleEditTurma}
        initialValues={editingTurma ?? undefined}
        isLoading={isLoading}
      />

      <SchoolFormBottomSheet
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEdit}
        initialValues={school}
        isLoading={schoolLoading}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Escola"
        message={`Tem certeza que deseja excluir "${school.name}"? Esta ação não pode ser desfeita e todas as turmas associadas serão excluídas.`}
        isLoading={isDeleting || schoolLoading}
      />

      <ConfirmDialog
        isOpen={deleteTurmaOpen}
        onClose={() => {
          setDeleteTurmaOpen(false)
          setSelectedTurma(null)
        }}
        onConfirm={handleDeleteTurma}
        title="Excluir Turma"
        message={`Tem certeza que deseja excluir "${selectedTurma?.name}"? Esta ação não pode ser desfeita.`}
        isLoading={isLoading}
      />

      <TurmaFilterBottomSheet
        isOpen={turmaFilterOpen}
        onClose={() => setTurmaFilterOpen(false)}
        filters={turmaFilters}
        onFiltersChange={setTurmaFilters}
      />
    </View>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/schools/SchoolDetailScreen.tsx
git commit -m "refactor: use extracted hooks and components in SchoolDetailScreen"
```
---

## Plan Complete

The refactoring extracts:
- **Hooks:** `useSchoolFilter`, `useTurmaFilter`
- **Components:** `SchoolListItem`, `SchoolCard`, `TurmaListItem`, `ShiftBadge`, `EmptyState`, `ErrorBanner`

Both screens now use composition with smaller, focused, reusable components.