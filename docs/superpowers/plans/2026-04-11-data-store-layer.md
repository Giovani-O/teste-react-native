# Data & Store Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement adapters, repositories, Zustand stores with AsyncStorage persistence, enabling MSW and Zustand to communicate.

**Architecture:** Clean Architecture with three layers - Domain (interfaces), Data (adapters + repositories), Store (Zustand). MSW intercepts fetch at network level.

**Tech Stack:** TypeScript, Zustand 5.0.12, AsyncStorage 2.2.0, MSW 2.13.2

---

### Task 1: Create School Adapter

**Files:**
- Create: `src/data/adapters/school.adapter.ts`

- [ ] **Step 1: Create adapter file**

```typescript
import { School, CreateSchoolDTO, UpdateSchoolDTO } from '../../domain/entities/School'

export interface RawSchoolResponse {
  id: string
  name: string
  address: string
  classCount: number
}

export function adaptSchool(raw: RawSchoolResponse): School {
  return {
    id: raw.id,
    name: raw.name,
    address: raw.address,
    classCount: raw.classCount ?? 0,
  }
}

export function adaptSchoolList(raw: RawSchoolResponse[]): School[] {
  return raw.map(adaptSchool)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/adapters/school.adapter.ts
git commit -m "feat: add school adapter"
```

---

### Task 2: Create Turma Adapter

**Files:**
- Create: `src/data/adapters/turma.adapter.ts`

- [ ] **Step 1: Create adapter file**

```typescript
import { Shift, Turma, CreateTurmaDTO, UpdateTurmaDTO } from '../../domain/entities/Turma'

export interface RawTurmaResponse {
  id: string
  name: string
  shift: Shift
  academicYear: number
  schoolId: string
}

export function adaptTurma(raw: RawTurmaResponse): Turma {
  return {
    id: raw.id,
    name: raw.name,
    shift: raw.shift,
    academicYear: raw.academicYear,
    schoolId: raw.schoolId,
  }
}

export function adaptTurmaList(raw: RawTurmaResponse[]): Turma[] {
  return raw.map(adaptTurma)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/adapters/turma.adapter.ts
git commit -m "feat: add turma adapter"
```

---

### Task 3: Create School Repository

**Files:**
- Create: `src/data/repositories/SchoolRepository.ts`

- [ ] **Step 1: Create repository file**

```typescript
import { School, CreateSchoolDTO, UpdateSchoolDTO } from '../../domain/entities/School'
import { ISchoolRepository } from '../../domain/repositories/ISchoolRepository'
import { adaptSchool, adaptSchoolList } from '../adapters/school.adapter'

const BASE_URL = '/api'

export class SchoolRepository implements ISchoolRepository {
  async findAll(): Promise<School[]> {
    const response = await fetch(`${BASE_URL}/schools`)
    if (!response.ok) {
      throw new Error('Failed to fetch schools')
    }
    const data = await response.json()
    return adaptSchoolList(data)
  }

  async findById(id: string): Promise<School | null> {
    const response = await fetch(`${BASE_URL}/schools/${id}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error('Failed to fetch school')
    }
    const data = await response.json()
    return adaptSchool(data)
  }

  async create(data: CreateSchoolDTO): Promise<School> {
    const response = await fetch(`${BASE_URL}/schools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create school')
    }
    const result = await response.json()
    return adaptSchool(result)
  }

  async update(id: string, data: UpdateSchoolDTO): Promise<School | null> {
    const response = await fetch(`${BASE_URL}/schools/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error('Failed to update school')
    }
    const result = await response.json()
    return adaptSchool(result)
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/schools/${id}`, {
      method: 'DELETE',
    })
    if (response.status === 404) {
      return false
    }
    if (!response.ok) {
      throw new Error('Failed to delete school')
    }
    return true
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/repositories/SchoolRepository.ts
git commit -m "feat: add school repository"
```

---

### Task 4: Create Turma Repository

**Files:**
- Create: `src/data/repositories/TurmaRepository.ts`

- [ ] **Step 1: Create repository file**

```typescript
import { CreateTurmaDTO, Turma, UpdateTurmaDTO } from '../../domain/entities/Turma'
import { ITurmaRepository } from '../../domain/repositories/ITurmaRepository'
import { adaptTurma, adaptTurmaList } from '../adapters/turma.adapter'

const BASE_URL = '/api'

export class TurmaRepository implements ITurmaRepository {
  async findBySchoolId(schoolId: string): Promise<Turma[]> {
    const response = await fetch(`${BASE_URL}/schools/${schoolId}/turmas`)
    if (!response.ok) {
      throw new Error('Failed to fetch turmas')
    }
    const data = await response.json()
    return adaptTurmaList(data)
  }

  async findById(id: string): Promise<Turma | null> {
    const response = await fetch(`${BASE_URL}/turmas/${id}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error('Failed to fetch turma')
    }
    const data = await response.json()
    return adaptTurma(data)
  }

  async create(data: CreateTurmaDTO): Promise<Turma> {
    const response = await fetch(`${BASE_URL}/turmas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create turma')
    }
    const result = await response.json()
    return adaptTurma(result)
  }

  async update(id: string, data: UpdateTurmaDTO): Promise<Turma | null> {
    const response = await fetch(`${BASE_URL}/turmas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error('Failed to update turma')
    }
    const result = await response.json()
    return adaptTurma(result)
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/turmas/${id}`, {
      method: 'DELETE',
    })
    if (response.status === 404) {
      return false
    }
    if (!response.ok) {
      throw new Error('Failed to delete turma')
    }
    return true
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/repositories/TurmaRepository.ts
git commit -m "feat: add turma repository"
```

---

### Task 5: Create Repository Factory

**Files:**
- Create: `src/data/repositories/factory.ts`

- [ ] **Step 1: Create factory file**

```typescript
import { ISchoolRepository } from '../../domain/repositories/ISchoolRepository'
import { ITurmaRepository } from '../../domain/repositories/ITurmaRepository'
import { SchoolRepository } from './SchoolRepository'
import { TurmaRepository } from './TurmaRepository'

export class RepositoryFactory {
  static createSchoolRepository(): ISchoolRepository {
    return new SchoolRepository()
  }

  static createTurmaRepository(): ITurmaRepository {
    return new TurmaRepository()
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/repositories/factory.ts
git commit -m "feat: add repository factory"
```

---

### Task 6: Create Schools Store

**Files:**
- Create: `src/store/schools.store.ts`

- [ ] **Step 1: Create store file**

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { School, CreateSchoolDTO, UpdateSchoolDTO } from '../domain/entities/School'
import { RepositoryFactory } from '../data/repositories/factory'

interface SchoolStore {
  schools: School[]
  isLoading: boolean
  error: string | null

  fetchSchools: () => Promise<void>
  createSchool: (data: CreateSchoolDTO) => Promise<void>
  updateSchool: (id: string, data: UpdateSchoolDTO) => Promise<void>
  deleteSchool: (id: string) => Promise<void>
  clearError: () => void
}

export const useSchoolsStore = create<SchoolStore>()(
  persist(
    (set, get) => {
      const repository = RepositoryFactory.createSchoolRepository()

      return {
        schools: [],
        isLoading: false,
        error: null,

        fetchSchools: async () => {
          set({ isLoading: true, error: null })
          try {
            const schools = await repository.findAll()
            set({ schools, isLoading: false })
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
          }
        },

        createSchool: async (data: CreateSchoolDTO) => {
          set({ isLoading: true, error: null })
          try {
            const newSchool = await repository.create(data)
            set((state) => ({
              schools: [...state.schools, newSchool],
              isLoading: false,
            }))
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
          }
        },

        updateSchool: async (id: string, data: UpdateSchoolDTO) => {
          set({ isLoading: true, error: null })
          try {
            const updated = await repository.update(id, data)
            if (updated) {
              set((state) => ({
                schools: state.schools.map((s) => (s.id === id ? updated : s)),
                isLoading: false,
              }))
            }
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
          }
        },

        deleteSchool: async (id: string) => {
          set({ isLoading: true, error: null })
          try {
            const success = await repository.delete(id)
            if (success) {
              set((state) => ({
                schools: state.schools.filter((s) => s.id !== id),
                isLoading: false,
              }))
            }
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
          }
        },

        clearError: () => set({ error: null }),
      }
    },
    {
      name: '@schools/list',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ schools: state.schools }),
    },
  )
)
```

- [ ] **Step 2: Commit**

```bash
git add src/store/schools.store.ts
git commit -m "feat: add schools store with AsyncStorage persistence"
```

---

### Task 7: Create Turmas Store

**Files:**
- Create: `src/store/turmas.store.ts`

- [ ] **Step 1: Create store file**

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CreateTurmaDTO, Turma, UpdateTurmaDTO } from '../domain/entities/Turma'
import { RepositoryFactory } from '../data/repositories/factory'

interface TurmaStore {
  turmas: Turma[]
  isLoading: boolean
  error: string | null

  fetchTurmasBySchool: (schoolId: string) => Promise<void>
  createTurma: (data: CreateTurmaDTO) => Promise<void>
  updateTurma: (id: string, data: UpdateTurmaDTO) => Promise<void>
  deleteTurma: (id: string) => Promise<void>
  clearError: () => void
}

export const useTurmasStore = create<TurmaStore>()(
  persist(
    (set) => {
      const repository = RepositoryFactory.createTurmaRepository()

      return {
        turmas: [],
        isLoading: false,
        error: null,

        fetchTurmasBySchool: async (schoolId: string) => {
          set({ isLoading: true, error: null })
          try {
            const turmas = await repository.findBySchoolId(schoolId)
            set({ turmas, isLoading: false })
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
          }
        },

        createTurma: async (data: CreateTurmaDTO) => {
          set({ isLoading: true, error: null })
          try {
            const newTurma = await repository.create(data)
            set((state) => ({
              turmas: [...state.turmas, newTurma],
              isLoading: false,
            }))
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
          }
        },

        updateTurma: async (id: string, data: UpdateTurmaDTO) => {
          set({ isLoading: true, error: null })
          try {
            const updated = await repository.update(id, data)
            if (updated) {
              set((state) => ({
                turmas: state.turmas.map((t) => (t.id === id ? updated : t)),
                isLoading: false,
              }))
            }
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
          }
        },

        deleteTurma: async (id: string) => {
          set({ isLoading: true, error: null })
          try {
            const success = await repository.delete(id)
            if (success) {
              set((state) => ({
                turmas: state.turmas.filter((t) => t.id !== id),
                isLoading: false,
              }))
            }
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
          }
        },

        clearError: () => set({ error: null }),
      }
    },
    {
      name: '@turmas/list',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ turmas: state.turmas }),
    },
  )
)
```

- [ ] **Step 2: Commit**

```bash
git add src/store/turmas.store.ts
git commit -m "feat: add turmas store with AsyncStorage persistence"
```

---

### Task 8: Create Verification Script

**Files:**
- Create: `scripts/verify-integration.ts`

- [ ] **Step 1: Create verification script**

```typescript
/**
 * Verification script - DELETE AFTER TESTING
 * Run with: npx ts-node --skipProject scripts/verify-integration.ts
 */

import { useSchoolsStore } from '../src/store/schools.store'

async function main() {
  console.log('Starting integration verification...')

  const store = useSchoolsStore.getState()

  console.log('Initial state:', { schools: store.schools.length })

  console.log('Fetching schools from MSW...')
  await store.fetchSchools()

  const state = useSchoolsStore.getState()
  console.log('After fetch:', { 
    schoolsCount: state.schools.length, 
    isLoading: state.isLoading,
    error: state.error 
  })

  if (state.schools.length > 0) {
    const firstSchool = state.schools[0]
    console.log('First school:', firstSchool)

    console.log('Creating new school...')
    await store.createSchool({
      name: 'Test School',
      address: 'Test Address 123',
    })

    const afterCreate = useSchoolsStore.getState()
    console.log('After create:', { schoolsCount: afterCreate.schools.length })

    console.log('\n✅ Integration verified! MSW and Zustand are talking.')
  } else {
    console.log('\n❌ No schools fetched - check MSW setup')
  }
}

main().catch(console.error)
```

- [ ] **Step 2: Commit**

```bash
git add scripts/verify-integration.ts
git commit -m "feat: add verification script (to be deleted)"
```

---

**Plan complete.** Tasks 1-8 implement the full data and store layer per SDD.md.
