import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Dataset, Widget, DashboardAPI } from '@/types'
import { fetchDashboards, saveDataset, saveDashboardToAPI, updateDashboardOnAPI } from '@/services/dataService'

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
  historyLoading: boolean
  historyError: string | null
  saveDashboard: (name: string, dataset: Dataset, widgets: Widget[]) => Promise<string>
  updateDashboard: (id: string, widgets: Widget[], dataset?: Dataset, name?: string) => void
  deleteDashboard: (id: string) => void
  loadDashboard: (id: string) => SavedDashboard | null
  currentDashboardId: string | null
  setCurrentDashboardId: (id: string | null) => void
}

const DataContext = createContext<DataContextType | null>(null)

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

export function DataProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<Dataset | null>(() => {
    if (!USE_REAL_API) {
      try {
        const saved = localStorage.getItem('mock_dataset')
        return saved ? JSON.parse(saved) : null
      } catch {
        return null
      }
    }
    return null
  })
  const [history, setHistory] = useState<SavedDashboard[]>(() => {
    if (!USE_REAL_API) {
      try {
        const saved = localStorage.getItem('mock_history')
        return saved ? JSON.parse(saved) : []
      } catch {
        return []
      }
    }
    return []
  })
  const [historyLoading, setHistoryLoading] = useState(() => {
    if (USE_REAL_API) {
      const token = localStorage.getItem('token')
      return !!token
    }
    return false
  })
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null)

  useEffect(() => {
    if (!USE_REAL_API) {
      localStorage.setItem('mock_history', JSON.stringify(history))
    }
  }, [history])

  useEffect(() => {
    if (!USE_REAL_API) {
      if (dataset) {
        localStorage.setItem('mock_dataset', JSON.stringify(dataset))
      } else {
        localStorage.removeItem('mock_dataset')
      }
    }
  }, [dataset])

  useEffect(() => {
    if (!USE_REAL_API) return
    const token = localStorage.getItem('token')
    if (!token) return

    setHistoryLoading(true)
    setHistoryError(null)
    fetchDashboards()
      .then((items: DashboardAPI[]) => {
        const mapped: SavedDashboard[] = items.map((d) => ({
          id: d.id,
          name: d.name,
          dataset: d.dataset ?? {
            id: d.datasetId,
            name: d.name,
            columns: d.dataset?.columns ?? [],
            rows: d.dataset?.rows ?? [],
            createdAt: d.createdAt,
          },
          widgets: d.widgets,
          createdAt: d.createdAt,
        }))
        setHistory(mapped)
      })
      .catch(() => {
        setHistoryError('Não foi possível carregar os dashboards. Verifique sua conexão.')
      })
      .finally(() => setHistoryLoading(false))
  }, [])

  const saveDashboard = async (name: string, dataset: Dataset, widgets: Widget[]): Promise<string> => {
    let finalDataset = dataset
    let id = Date.now().toString()

    if (USE_REAL_API) {
      const savedDataset = await saveDataset(dataset)
      finalDataset = savedDataset
      id = await saveDashboardToAPI(name, savedDataset.id, widgets)
    }

    const newDash: SavedDashboard = {
      id,
      name,
      dataset: finalDataset,
      widgets,
      createdAt: new Date().toISOString(),
    }
    setHistory(h => [newDash, ...h])
    setCurrentDashboardId(id)
    return id
  }

  const updateDashboard = (id: string, widgets: Widget[], updatedDataset?: Dataset, name?: string) => {
    setHistory(h => h.map(d => d.id === id ? { 
      ...d, 
      widgets,
      dataset: updatedDataset ?? d.dataset,
      name: name ?? d.name
    } : d))
    if (USE_REAL_API) updateDashboardOnAPI(id, widgets).catch(() => {})
  }

  const deleteDashboard = (id: string) => {
    setHistory(h => h.filter(d => d.id !== id))
    if (currentDashboardId === id) setCurrentDashboardId(null)
  }

  const loadDashboard = (id: string) => history.find(d => d.id === id) ?? null

  return (
    <DataContext.Provider value={{
      dataset, setDataset,
      history, historyLoading, historyError,
      saveDashboard, updateDashboard, deleteDashboard, loadDashboard,
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