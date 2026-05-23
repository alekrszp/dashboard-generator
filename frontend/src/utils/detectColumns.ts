export type ColumnType = 'numeric' | 'category' | 'date'

export interface ColumnInfo {
  name: string
  type: ColumnType
}

export function detectColumns(columns: string[], rows: Record<string, any>[]): ColumnInfo[] {
  return columns.map(col => {
    const values = rows.map(r => r[col]).filter(v => v !== null && v !== undefined && v !== '')

    const numericCount = values.filter(v => !isNaN(Number(v))).length
    const dateCount = values.filter(v => !isNaN(Date.parse(String(v))) && isNaN(Number(v))).length

    if (numericCount / values.length > 0.8) return { name: col, type: 'numeric' }
    if (dateCount / values.length > 0.5) return { name: col, type: 'date' }
    return { name: col, type: 'category' }
  })
}

export function suggestChartType(xCol: ColumnInfo, yCol: ColumnInfo): string {
  if (xCol.type === 'date') return 'line'
  if (xCol.type === 'category' && yCol.type === 'numeric') return 'bar'
  if (yCol.type === 'numeric') return 'pie'
  return 'bar'
}