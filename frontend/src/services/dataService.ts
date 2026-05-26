import api from './api'
import { Dataset, Widget } from '@/types'

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

export async function saveDataset(dataset: Dataset): Promise<Dataset> {
  if (USE_REAL_API) {
    const { data } = await api.post('/datasets', {
      name: dataset.name,
      columns: dataset.columns,
      rows: dataset.rows,
    })
    return data
  }
  return dataset
}

export async function saveDashboardToAPI(
  name: string,
  datasetId: string,
  widgets: Widget[]
): Promise<string> {
  if (USE_REAL_API) {
    const { data } = await api.post('/dashboards', { name, datasetId, widgets })
    return data.id
  }
  return Date.now().toString()
}

export async function updateDashboardOnAPI(
  id: string,
  widgets: Widget[]
): Promise<void> {
  if (USE_REAL_API) {
    await api.put(`/dashboards/${id}`, { widgets })
  }
}

export async function deleteDashboardOnAPI(id: string): Promise<void> {
  if (USE_REAL_API) {
    await api.delete(`/dashboards/${id}`)
  }
}

export async function fetchDashboards(): Promise<any[]> {
  if (USE_REAL_API) {
    const { data } = await api.get('/dashboards')
    return data
  }
  return []
}