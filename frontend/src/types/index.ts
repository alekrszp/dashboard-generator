export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export type DatasetRow = Record<string, string | number>

export interface Dataset {
  id: string
  name: string
  columns: string[]
  rows: DatasetRow[]
  createdAt: string
}

export type ChartType = 'bar' | 'line' | 'pie' | 'table' | 'area' | 'radar'

export interface Widget {
  id: string
  type: ChartType
  title: string
  xKey: string
  yKey: string
  color: string
}

export interface Dashboard {
  id: string
  name: string
  datasetId: string
  widgets: Widget[]
  createdAt: string
  updatedAt: string
}