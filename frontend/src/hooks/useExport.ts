import { useRef } from 'react'
import { exportToPNG, exportToCSV } from '@/utils/exportUtils'
import { Dataset } from '@/types'

export function useExport(dataset: Dataset | null, title: string) {
  const ref = useRef<HTMLDivElement>(null)

  const handleExportPNG = async () => {
    if (!ref.current) return
    await exportToPNG(ref.current, title)
  }

  const handleExportCSV = () => {
    if (!dataset) return
    exportToCSV(dataset.columns, dataset.rows, title)
  }

  return { ref, handleExportPNG, handleExportCSV }
}