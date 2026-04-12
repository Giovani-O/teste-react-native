import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { RepositoryFactory } from '../data/repositories/factory'
import { CreateTurmaDTO, Turma, UpdateTurmaDTO } from '../domain/entities/Turma'

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
  ),
)
