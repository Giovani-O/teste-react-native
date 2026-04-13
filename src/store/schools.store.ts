import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { RepositoryFactory } from '../data/repositories/factory'
import {
  CreateSchoolDTO,
  School,
  UpdateSchoolDTO,
} from '../domain/entities/School'

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
  ),
)
