import { createContext, useContext, useState, ReactNode } from 'react'
import { Dataset, Widget } from '@/types'

export interface SavedDashboard {
  id: string
  name: string
  dataset: Dataset
  widgets: Widget[]
  createdAt: string
}

interface DataContextType {
  dataset: Dataset | null
  setDataset: (dataset: Dataset | null) => void
  history: SavedDashboard[]
  saveDashboard: (name: string, dataset: Dataset, widgets: Widget[]) => void
  deleteDashboard: (id: string) => void
  loadDashboard: (id: string) => SavedDashboard | null
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [history, setHistory] = useState<SavedDashboard[]>([])

  const saveDashboard = (name: string, dataset: Dataset, widgets: Widget[]) => {
    const newDash: SavedDashboard = {
      id: Date.now().toString(),
      name,
      dataset,
      widgets,
      createdAt: new Date().toISOString(),
    }
    setHistory(h => [newDash, ...h])
  }

  const deleteDashboard = (id: string) => {
    setHistory(h => h.filter(d => d.id !== id))
  }

  const loadDashboard = (id: string) => {
    return history.find(d => d.id === id) ?? null
  }

  return (
    <DataContext.Provider value={{ dataset, setDataset, history, saveDashboard, deleteDashboard, loadDashboard }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}