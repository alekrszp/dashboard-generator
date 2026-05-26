import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useData } from '@/hooks/useData'
import { useExport } from '@/hooks/useExport'
import { ChartType, Widget, DatasetRow } from '@/types'
import Navbar from '@/components/Navbar'
import WidgetCard from '@/components/WidgetCard'
import ConfirmModal from '@/components/ConfirmModal'
import DataEditor from '@/components/DataEditor'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'

const COLORS = ['#4d9de0', '#1976d2', '#64b5f6', '#1565c0', '#90caf9', '#0d47a1']

const btnGhost = {
  fontSize: '12px', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
  border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#7a8fa6',
}

type Tab = 'charts' | 'data'

export default function DashboardPage() {
  const {
    dataset: ctxDataset, saveDashboard, updateDashboard,
    loadDashboard, setDataset, currentDashboardId,
  } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const hasSaved = useRef(false)

  const fromHistory = location.state?.fromHistory
  const savedDash = id && id !== 'new' ? loadDashboard(id) : null
  const dataset = savedDash ? savedDash.dataset : ctxDataset

  const [activeTab, setActiveTab] = useState<Tab>('charts')
  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [dashTitle, setDashTitle] = useState(savedDash?.name ?? ctxDataset?.name ?? 'Meu Dashboard')
  const [hasUnsavedData, setHasUnsavedData] = useState(false)
  const [confirm, setConfirm] = useState<{ message: string; action: () => void } | null>(null)

  const [localRows, setLocalRows] = useState<DatasetRow[]>(dataset?.rows ?? [])
  const [localColumns, setLocalColumns] = useState<string[]>(dataset?.columns ?? [])

  const [widgets, setWidgets] = useState<Widget[]>(() => {
    if (savedDash) return savedDash.widgets
    if (location.state?.widgets) return location.state.widgets
    if (!ctxDataset) return []
    const cols = ctxDataset.columns
    const xKey = cols[0]
    return cols.slice(1).map((yKey, i) => ({
      id: String(i),
      type: (i === 0 ? 'bar' : i === 1 ? 'line' : 'pie') as ChartType,
      title: `${yKey} por ${xKey}`,
      xKey,
      yKey,
      color: COLORS[i % COLORS.length],
    }))
  })

  const { ref: exportRef, handleExportPNG, handleExportCSV } = useExport(
    dataset ? { ...dataset, rows: localRows, columns: localColumns } : null,
    dashTitle
  )

  useEffect(() => {
    if (dataset && widgets.length > 0 && !hasSaved.current && !fromHistory && id === 'new') {
      const doSave = async () => {
        let newId: string
        if (!currentDashboardId) {
          newId = await saveDashboard(dashTitle, dataset, widgets)
        } else {
          updateDashboard(currentDashboardId, widgets)
          newId = currentDashboardId
        }
        navigate(`/dashboard/${newId}`, { replace: true, state: { widgets, fromHistory: false } })
        hasSaved.current = true
        setSaved(true)
      }
      doSave()
    }
  }, [])

  const askConfirm = (message: string, action: () => void) => setConfirm({ message, action })

  const handleTabChange = (tab: Tab) => {
    if (activeTab === 'data' && hasUnsavedData && tab === 'charts') {
      askConfirm('Você tem alterações não aplicadas. Deseja descartá-las?', () => {
        setLocalRows(dataset?.rows ?? [])
        setLocalColumns(dataset?.columns ?? [])
        setHasUnsavedData(false)
        setActiveTab(tab)
      })
    } else {
      setActiveTab(tab)
    }
  }

  const applyDataChanges = () => {
    if (!dataset) return
    setDataset({ ...dataset, columns: localColumns, rows: localRows })
    setHasUnsavedData(false)
    setActiveTab('charts')
  }

  const discardDataChanges = () => {
    askConfirm('Deseja descartar todas as alterações nos dados?', () => {
      setLocalRows(dataset?.rows ?? [])
      setLocalColumns(dataset?.columns ?? [])
      setHasUnsavedData(false)
    })
  }

  const updateCell = (ri: number, col: string, val: string) => {
    setHasUnsavedData(true)
    setLocalRows(rows => rows.map((row, i) => i === ri ? { ...row, [col]: val } : row))
  }

  const addRow = () => {
    setHasUnsavedData(true)
    setLocalRows(rows => [...rows, Object.fromEntries(localColumns.map(c => [c, '']))])
  }

  const removeRow = (ri: number) => {
    askConfirm('Deseja remover esta linha? Esta ação não pode ser desfeita.', () => {
      setHasUnsavedData(true)
      setLocalRows(rows => rows.filter((_, i) => i !== ri))
    })
  }

  const addColumn = () => {
    const name = `Coluna ${localColumns.length + 1}`
    setHasUnsavedData(true)
    setLocalColumns(cols => [...cols, name])
    setLocalRows(rows => rows.map(row => ({ ...row, [name]: '' })))
  }

  const renameColumn = (oldName: string, newName: string) => {
    setHasUnsavedData(true)
    setLocalColumns(cols => cols.map(c => c === oldName ? newName : c))
    setLocalRows(rows => rows.map(row => {
      const val = row[oldName]
      const { [oldName]: _, ...rest } = row as any
      return { ...rest, [newName]: val }
    }))
  }

  const removeColumn = (col: string) => {
    askConfirm(`Deseja remover a coluna "${col}"? Os dados serão perdidos.`, () => {
      setHasUnsavedData(true)
      setLocalColumns(cols => cols.filter(c => c !== col))
      setLocalRows(rows => rows.map(row => {
        const { [col]: _, ...rest } = row as any
        return rest
      }))
    })
  }

  const updateWidget = (id: string, changes: Partial<Widget>) =>
    setWidgets(ws => ws.map(w => w.id === id ? { ...w, ...changes } : w))

  const handleRemoveWidget = (id: string) => {
    askConfirm('Deseja remover este gráfico?', () => {
      setWidgets(ws => ws.filter(w => w.id !== id))
    })
  }

  const duplicateWidget = (w: Widget) => {
    setWidgets(ws => {
      const idx = ws.findIndex(x => x.id === w.id)
      const copy = { ...w, id: Date.now().toString(), title: `${w.title} (cópia)` }
      const next = [...ws]
      next.splice(idx + 1, 0, copy)
      return next
    })
  }

  const addWidget = () => {
    setWidgets(ws => [...ws, {
      id: Date.now().toString(),
      type: 'bar' as ChartType,
      title: 'Novo gráfico',
      xKey: localColumns[0],
      yKey: localColumns[1] ?? localColumns[0],
      color: COLORS[ws.length % COLORS.length],
    }])
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(widgets)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    setWidgets(items)
  }

  if (!dataset) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#7a8fa6', marginBottom: '1rem' }}>Nenhum dado encontrado.</p>
            <button onClick={() => navigate('/')} style={{
              background: 'linear-gradient(90deg, #1565c0, #1976d2)',
              color: '#fff', border: 'none', borderRadius: '6px',
              padding: '9px 20px', fontSize: '14px', cursor: 'pointer',
            }}>Voltar</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={() => { confirm.action(); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              {editingTitle ? (
                <input
                  autoFocus value={dashTitle}
                  onChange={e => setDashTitle(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
                  style={{
                    fontSize: '20px', fontWeight: 500, background: 'transparent',
                    border: 'none', borderBottom: '1px solid rgba(100,160,255,0.4)',
                    color: '#e8eaf0', outline: 'none', width: '300px',
                  }}
                />
              ) : (
                <h1
                  onClick={() => setEditingTitle(true)}
                  style={{ fontSize: '20px', fontWeight: 500, color: '#e8eaf0', margin: 0, cursor: 'pointer' }}
                  title="Clique para editar o título"
                >
                  {dashTitle}
                </h1>
              )}
              <p style={{ fontSize: '13px', color: '#7a8fa6', marginTop: '4px' }}>
                {localRows.length} linhas · {localColumns.length} colunas
                {saved && <span style={{ color: '#6ac96a', marginLeft: '8px' }}>· salvo</span>}
                {hasUnsavedData && <span style={{ color: '#f59e0b', marginLeft: '8px' }}>· dados não aplicados</span>}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/config', { state: { widgets } })} style={btnGhost}>
                Configurar
              </button>
              <button onClick={handleExportCSV} style={btnGhost}>Exportar CSV</button>
              <button onClick={handleExportPNG} style={btnGhost}>Exportar PNG</button>
              <button onClick={addWidget} style={{
                fontSize: '13px', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer',
                border: 'none', background: 'linear-gradient(90deg, #1565c0, #1976d2)', color: '#fff',
              }}>
                Adicionar gráfico
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
            {(['charts', 'data'] as Tab[]).map(t => (
              <button key={t} onClick={() => handleTabChange(t)} style={{
                padding: '7px 18px', fontSize: '13px', borderRadius: '6px', cursor: 'pointer',
                border: '1px solid rgba(100,160,255,0.2)',
                background: activeTab === t ? 'rgba(100,160,255,0.15)' : 'transparent',
                color: activeTab === t ? '#e8eaf0' : '#7a8fa6',
                position: 'relative',
              }}>
                {t === 'charts' ? 'Gráficos' : 'Dados'}
                {t === 'data' && hasUnsavedData && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#f59e0b',
                  }} />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'charts' && (
            <div ref={exportRef}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="widgets" direction="vertical">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                      {widgets.map((w, index) => (
                        <WidgetCard
                          key={w.id} widget={w} index={index}
                          dataset={{ ...dataset, rows: localRows, columns: localColumns }}
                          editing={editing}
                          onEdit={id => setEditing(prev => prev === id ? null : id)}
                          onUpdate={updateWidget}
                          onRemove={handleRemoveWidget}
                          onDuplicate={duplicateWidget}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}

          {activeTab === 'data' && (
            <DataEditor
              columns={localColumns}
              rows={localRows}
              hasUnsavedData={hasUnsavedData}
              onUpdateCell={updateCell}
              onAddRow={addRow}
              onRemoveRow={removeRow}
              onAddColumn={addColumn}
              onRenameColumn={renameColumn}
              onRemoveColumn={removeColumn}
              onApply={applyDataChanges}
              onDiscard={discardDataChanges}
            />
          )}

        </div>
      </div>
    </>
  )
}