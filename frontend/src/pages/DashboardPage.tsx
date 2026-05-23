import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useData } from '@/hooks/useData'
import { useExport } from '@/hooks/useExport'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { ChartType, Widget } from '@/types'
import Navbar from '@/components/Navbar'
import WidgetCard from '@/components/WidgetCard'

const COLORS = ['#4d9de0', '#1976d2', '#64b5f6', '#1565c0', '#90caf9', '#0d47a1']

const btnGhost = {
  fontSize: '12px', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
  border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#7a8fa6',
}

export default function DashboardPage() {
  const {
    dataset: ctxDataset, saveDashboard, updateDashboard,
    loadDashboard, setDataset, currentDashboardId, setCurrentDashboardId
  } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const hasSaved = useRef(false)

  const fromHistory = location.state?.fromHistory
  const savedDash = id && id !== 'new' ? loadDashboard(id) : null
  const dataset = savedDash ? savedDash.dataset : ctxDataset

  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [dashTitle, setDashTitle] = useState(savedDash?.name ?? ctxDataset?.name ?? 'Meu Dashboard')

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

  const { ref: dashboardRef, handleExportPNG, handleExportCSV } = useExport(dataset, dashTitle)

  useEffect(() => {
    if (dataset && widgets.length > 0 && !hasSaved.current && !fromHistory && id === 'new') {
      if (!currentDashboardId) {
        const newId = saveDashboard(dashTitle, dataset, widgets)
        navigate(`/dashboard/${newId}`, { replace: true, state: { widgets, fromHistory: false } })
      } else {
        updateDashboard(currentDashboardId, widgets)
        navigate(`/dashboard/${currentDashboardId}`, { replace: true, state: { widgets, fromHistory: false } })
      }
      hasSaved.current = true
      setSaved(true)
    }
  }, [])

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

  const updateWidget = (id: string, changes: Partial<Widget>) =>
    setWidgets(ws => ws.map(w => w.id === id ? { ...w, ...changes } : w))

  const removeWidget = (id: string) =>
    setWidgets(ws => ws.filter(w => w.id !== id))

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
      xKey: dataset.columns[0],
      yKey: dataset.columns[1] ?? dataset.columns[0],
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

  const handleEdit = (id: string) => {
    setEditing(prev => prev === id ? null : id)
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              {editingTitle ? (
                <input
                  autoFocus
                  value={dashTitle}
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
                  title="Clique para editar"
                >
                  {dashTitle} ✏️
                </h1>
              )}
              <p style={{ fontSize: '13px', color: '#7a8fa6', marginTop: '4px' }}>
                {dataset.rows.length} linhas · {dataset.columns.length} colunas
                {saved && <span style={{ color: '#6ac96a', marginLeft: '8px' }}>· salvo</span>}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/config', { state: { widgets } })} style={btnGhost}>← Configurar</button>
              <button onClick={handleExportCSV} style={btnGhost}>⬇ CSV</button>
              <button onClick={handleExportPNG} style={btnGhost}>⬇ PNG</button>
              <button onClick={addWidget} style={{
                fontSize: '13px', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer',
                border: 'none', background: 'linear-gradient(90deg, #1565c0, #1976d2)', color: '#fff',
              }}>
                + Adicionar gráfico
              </button>
            </div>
          </div>

          <div ref={dashboardRef}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="widgets" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1rem' }}
                  >
                    {widgets.map((w, index) => (
                      <WidgetCard
                        key={w.id}
                        widget={w}
                        index={index}
                        dataset={dataset}
                        editing={editing}
                        onEdit={handleEdit}
                        onUpdate={updateWidget}
                        onRemove={removeWidget}
                        onDuplicate={duplicateWidget}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

        </div>
      </div>
    </>
  )
}