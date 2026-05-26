import { Widget, ChartType, Dataset } from '@/types'
import ChartRenderer from './ChartRenderer'
import { Draggable } from '@hello-pangea/dnd'

interface WidgetCardProps {
  widget: Widget
  index: number
  dataset: Dataset
  editing: string | null
  onEdit: (id: string) => void
  onUpdate: (id: string, changes: Partial<Widget>) => void
  onRemove: (id: string) => void
  onDuplicate: (widget: Widget) => void
}

const CHART_TYPES: { type: ChartType; label: string }[] = [
  { type: 'bar', label: 'Barra' },
  { type: 'line', label: 'Linha' },
  { type: 'pie', label: 'Pizza' },
  { type: 'area', label: 'Área' },
  { type: 'radar', label: 'Radar' },
  { type: 'table', label: 'Tabela' },
]

const btnGhost = {
  fontSize: '12px', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer',
  border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#7a8fa6',
  whiteSpace: 'nowrap' as const,
}

const selectStyle = {
  width: '100%', background: '#0d1929',
  border: '1px solid rgba(100,160,255,0.2)',
  borderRadius: '6px', padding: '6px 8px',
  fontSize: '12px', color: '#e8eaf0',
  boxSizing: 'border-box' as const,
}

export default function WidgetCard({ widget: w, index, dataset, editing, onEdit, onUpdate, onRemove, onDuplicate }: WidgetCardProps) {
  return (
    <Draggable draggableId={w.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            background: 'rgba(13, 25, 45, 0.85)',
            border: '1px solid rgba(100, 160, 255, 0.2)',
            borderRadius: '10px', padding: '1.25rem',
            opacity: snapshot.isDragging ? 0.85 : 1,
            ...provided.draggableProps.style,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <span
                {...provided.dragHandleProps}
                style={{ cursor: 'grab', color: '#3d5068', fontSize: '13px', letterSpacing: '2px', userSelect: 'none', flexShrink: 0 }}
              >
                ····
              </span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#e8eaf0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {w.title}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
              <button onClick={() => onDuplicate(w)} style={btnGhost}>Duplicar</button>
              <button onClick={() => onEdit(w.id)} style={btnGhost}>
                {editing === w.id ? 'Fechar' : 'Editar'}
              </button>
              <button onClick={() => onRemove(w.id)} style={{ ...btnGhost, color: '#f87171', borderColor: 'rgba(248,113,113,0.2)' }}>
                Remover
              </button>
            </div>
          </div>

          {/* Edit panel */}
          {editing === w.id && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', marginBottom: '1rem', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px' }}>TÍTULO</label>
                <input value={w.title} onChange={e => onUpdate(w.id, { title: e.target.value })}
                  style={{ ...selectStyle, background: 'rgba(255,255,255,0.05)' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px' }}>TIPO</label>
                <select value={w.type} onChange={e => onUpdate(w.id, { type: e.target.value as ChartType })} style={selectStyle}>
                  {CHART_TYPES.map(ct => <option key={ct.type} value={ct.type}>{ct.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px' }}>EIXO X</label>
                <select value={w.xKey} onChange={e => onUpdate(w.id, { xKey: e.target.value })} style={selectStyle}>
                  {dataset.columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px' }}>EIXO Y</label>
                <select value={w.yKey} onChange={e => onUpdate(w.id, { yKey: e.target.value })} style={selectStyle}>
                  {dataset.columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px' }}>COR</label>
                <input type="color" value={w.color} onChange={e => onUpdate(w.id, { color: e.target.value })}
                  style={{ width: '100%', height: '32px', background: 'none', border: '1px solid rgba(100,160,255,0.2)', borderRadius: '6px', cursor: 'pointer' }} />
              </div>
            </div>
          )}

          <ChartRenderer widget={w} data={dataset.rows} columns={dataset.columns} />
        </div>
      )}
    </Draggable>
  )
}