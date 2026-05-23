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
  saveDashboard: (name: string, dataset: Dataset, widgets: Widget[]) => string
  updateDashboard: (id: string, widgets: Widget[]) => void
  deleteDashboard: (id: string) => void
  loadDashboard: (id: string) => SavedDashboard | null
  currentDashboardId: string | null
  setCurrentDashboardId: (id: string | null) => void
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [history, setHistory] = useState<SavedDashboard[]>([])
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null)

  const saveDashboard = (name: string, dataset: Dataset, widgets: Widget[]): string => {
    const id = Date.now().toString()
    const newDash: SavedDashboard = {
      id,
      name,
      dataset,
      widgets,
      createdAt: new Date().toISOString(),
    }
    setHistory(h => [newDash, ...h])
    setCurrentDashboardId(id)
    return id
  }

  const updateDashboard = (id: string, widgets: Widget[]) => {
    setHistory(h => h.map(d => d.id === id ? { ...d, widgets } : d))
  }

  const deleteDashboard = (id: string) => {
    setHistory(h => h.filter(d => d.id !== id))
    if (currentDashboardId === id) setCurrentDashboardId(null)
  }

  const loadDashboard = (id: string) => {
    return history.find(d => d.id === id) ?? null
  }

  return (
    <DataContext.Provider value={{
      dataset, setDataset,
      history, saveDashboard, updateDashboard, deleteDashboard, loadDashboard,
      currentDashboardId, setCurrentDashboardId,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}