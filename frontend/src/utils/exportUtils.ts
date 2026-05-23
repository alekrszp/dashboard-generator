import html2canvas from 'html2canvas'

export async function exportToPNG(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, { backgroundColor: '#0d1929', scale: 2 })
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = canvas.toDataURL()
  link.click()
}

export function exportToCSV(columns: string[], rows: Record<string, any>[], filename: string) {
  const header = columns.join(',')
  const data = rows.map(row => columns.map(col => `"${row[col] ?? ''}"`).join(','))
  const csv = [header, ...data].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
}