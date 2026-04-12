export interface School {
  id: string
  name: string
  address: string
  classCount: number
}

export interface CreateSchoolDTO {
  name: string
  address: string
}

export interface UpdateSchoolDTO {
  name?: string
  address?: string
}
