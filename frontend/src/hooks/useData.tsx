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
  updateDashboard: (id: string, widgets: Widget[]) => void
  deleteDashboard: (id: string) => void
  loadDashboard: (id: string) => SavedDashboard | null
  currentDashboardId: string | null
  setCurrentDashboardId: (id: string | null) => void
}

const DataContext = createContext<DataContextType | null>(null)

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

export function DataProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [history, setHistory] = useState<SavedDashboard[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null)

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

  const updateDashboard = (id: string, widgets: Widget[]) => {
    setHistory(h => h.map(d => d.id === id ? { ...d, widgets } : d))
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