import { DatasetRow } from '@/types'

interface DataTableProps {
  columns: string[]
  rows: DatasetRow[]
}

export default function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} style={{
                textAlign: 'left', padding: '6px 10px',
                color: '#7a8fa6', borderBottom: '1px solid rgba(100,160,255,0.15)',
                whiteSpace: 'nowrap',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col} style={{
                  padding: '6px 10px', color: '#c8cdd6',
                  borderBottom: '1px solid rgba(100,160,255,0.08)',
                }}>
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}