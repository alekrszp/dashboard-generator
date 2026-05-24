import { DatasetRow } from '@/types'

interface DataEditorProps {
  columns: string[]
  rows: DatasetRow[]
  hasUnsavedData: boolean
  onUpdateCell: (ri: number, col: string, val: string) => void
  onAddRow: () => void
  onRemoveRow: (ri: number) => void
  onAddColumn: () => void
  onRenameColumn: (oldName: string, newName: string) => void
  onRemoveColumn: (col: string) => void
  onApply: () => void
  onDiscard: () => void
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(100,160,255,0.15)',
  borderRadius: '4px',
  padding: '5px 8px',
  fontSize: '12px',
  color: '#e8eaf0',
  fontFamily: 'Segoe UI, sans-serif',
}

const btnGhost = {
  fontSize: '12px', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
  border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#7a8fa6',
}

export default function DataEditor({
  columns, rows, hasUnsavedData,
  onUpdateCell, onAddRow, onRemoveRow,
  onAddColumn, onRenameColumn, onRemoveColumn,
  onApply, onDiscard,
}: DataEditorProps) {
  return (
    <div style={{
      background: 'rgba(13,25,45,0.85)',
      border: '1px solid rgba(100,160,255,0.2)',
      borderRadius: '10px', padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#e8eaf0', margin: 0 }}>
          Editar dados
          <span style={{ fontSize: '12px', color: '#7a8fa6', marginLeft: '8px', fontWeight: 400 }}>
            {rows.length} linhas · {columns.length} colunas
          </span>
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onAddColumn} style={btnGhost}>+ Coluna</button>
          <button onClick={onAddRow} style={btnGhost}>+ Linha</button>
          {hasUnsavedData && (
            <button onClick={onDiscard} style={{ ...btnGhost, color: '#f87171', borderColor: 'rgba(248,113,113,0.2)' }}>
              Descartar
            </button>
          )}
          <button onClick={onApply} style={{
            fontSize: '12px', padding: '5px 14px', borderRadius: '6px', cursor: 'pointer',
            border: 'none',
            background: hasUnsavedData ? 'linear-gradient(90deg, #1565c0, #1976d2)' : 'rgba(100,160,255,0.1)',
            color: hasUnsavedData ? '#fff' : '#7a8fa6',
          }}>
            ✓ Aplicar e ver gráficos
          </button>
        </div>
      </div>

      {hasUnsavedData && (
        <div style={{
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem',
          fontSize: '13px', color: '#f59e0b',
        }}>
          ⚠️ Você tem alterações não aplicadas. Clique em "Aplicar e ver gráficos" para atualizar os gráficos.
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col} style={{ padding: '4px 6px', borderBottom: '1px solid rgba(100,160,255,0.15)', minWidth: '130px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      value={col}
                      onChange={e => onRenameColumn(col, e.target.value)}
                      style={{ ...inputStyle, fontWeight: 500, flex: 1 }}
                    />
                    <button
                      onClick={() => onRemoveColumn(col)}
                      title="Remover coluna"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '16px', padding: '2px', flexShrink: 0 }}
                    >×</button>
                  </div>
                </th>
              ))}
              <th style={{ width: '36px' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: '1px solid rgba(100,160,255,0.05)' }}>
                {columns.map(col => (
                  <td key={col} style={{ padding: '3px 6px' }}>
                    <input
                      value={String(row[col] ?? '')}
                      onChange={e => onUpdateCell(ri, col, e.target.value)}
                      style={inputStyle}
                    />
                  </td>
                ))}
                <td style={{ padding: '3px 6px', textAlign: 'center' }}>
                  <button
                    onClick={() => onRemoveRow(ri)}
                    title="Remover linha"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '16px' }}
                  >×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={onAddRow} style={{
        marginTop: '12px', width: '100%', padding: '8px',
        borderRadius: '6px', cursor: 'pointer',
        border: '1px dashed rgba(100,160,255,0.2)',
        background: 'transparent', color: '#7a8fa6', fontSize: '13px',
      }}>
        + Adicionar linha
      </button>
    </div>
  )
}