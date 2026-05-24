import api from './api'
import { Dataset, Widget } from '@/types'

// trocar USE_REAL_API para true quando o
// backend estiver pronto
const USE_REAL_API = false

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

export async function fetchDashboards(): Promise<any[]> {
  if (USE_REAL_API) {
    const { data } = await api.get('/dashboards')
    return data
  }
  return []
}