import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useData } from '@/hooks/useData'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import html2canvas from 'html2canvas'
import { ChartType, Widget } from '@/types'
import Navbar from '@/components/Navbar'

const COLORS = ['#4d9de0', '#1976d2', '#64b5f6', '#1565c0', '#90caf9', '#0d47a1']

const card = {
  background: 'rgba(13, 25, 45, 0.85)',
  border: '1px solid rgba(100, 160, 255, 0.2)',
  borderRadius: '10px',
  padding: '1.25rem',
}

const btnGhost = {
  fontSize: '12px', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
  border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#7a8fa6',
}

const CHART_TYPES: { type: ChartType; label: string }[] = [
  { type: 'bar', label: 'Barra' },
  { type: 'line', label: 'Linha' },
  { type: 'pie', label: 'Pizza' },
  { type: 'area', label: 'Área' },
  { type: 'radar', label: 'Radar' },
  { type: 'table', label: 'Tabela' },
]

export default function DashboardPage() {
  const { dataset: ctxDataset, saveDashboard, loadDashboard, setDataset } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const hasSaved = useRef(false)
  const dashboardRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (dataset && widgets.length > 0 && !hasSaved.current && !fromHistory && id === 'new') {
      saveDashboard(dashTitle, dataset, widgets)
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
      type: 'bar',
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

  const exportPNG = async () => {
    if (!dashboardRef.current) return
    const canvas = await html2canvas(dashboardRef.current, { backgroundColor: '#0d1929', scale: 2 })
    const link = document.createElement('a')
    link.download = `${dashTitle}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const exportCSV = () => {
    const cols = dataset.columns
    const header = cols.join(',')
    const rows = dataset.rows.map(row => cols.map(col => `"${row[col] ?? ''}"`).join(','))
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${dashTitle}.csv`
    link.click()
  }

  const renderChart = (w: Widget) => {
    const data = dataset.rows
    const tooltipStyle = { background: '#0d1929', border: '1px solid rgba(100,160,255,0.2)', borderRadius: 6 }
    const tickStyle = { fill: '#7a8fa6', fontSize: 12 }
    const gridStyle = { strokeDasharray: '3 3', stroke: 'rgba(100,160,255,0.1)' }

    if (w.type === 'bar') return (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={w.xKey} tick={tickStyle} />
          <YAxis tick={tickStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey={w.yKey} fill={w.color ?? '#4d9de0'} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
    if (w.type === 'line') return (
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={w.xKey} tick={tickStyle} />
          <YAxis tick={tickStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey={w.yKey} stroke={w.color ?? '#4d9de0'} strokeWidth={2} dot={{ fill: w.color }} />
        </LineChart>
      </ResponsiveContainer>
    )
    if (w.type === 'area') return (
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={w.xKey} tick={tickStyle} />
          <YAxis tick={tickStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey={w.yKey} stroke={w.color ?? '#4d9de0'} fill={`${w.color ?? '#4d9de0'}33`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    )
    if (w.type === 'radar') return (
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(100,160,255,0.15)" />
          <PolarAngleAxis dataKey={w.xKey} tick={tickStyle} />
          <Radar dataKey={w.yKey} stroke={w.color ?? '#4d9de0'} fill={`${w.color ?? '#4d9de0'}33`} strokeWidth={2} />
          <Tooltip contentStyle={tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    )
    if (w.type === 'pie') return (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey={w.yKey} nameKey={w.xKey} cx="50%" cy="50%" outerRadius={80} label>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ color: '#7a8fa6', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    )
    if (w.type === 'table') return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              {dataset.columns.map(col => (
                <th key={col} style={{ textAlign: 'left', padding: '6px 10px', color: '#7a8fa6', borderBottom: '1px solid rgba(100,160,255,0.15)' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.rows.map((row, i) => (
              <tr key={i}>
                {dataset.columns.map(col => (
                  <td key={col} style={{ padding: '6px 10px', color: '#c8cdd6', borderBottom: '1px solid rgba(100,160,255,0.08)' }}>
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
              <button onClick={() => navigate('/config')} style={btnGhost}>← Configurar</button>
              <button onClick={exportCSV} style={btnGhost}>⬇ CSV</button>
              <button onClick={exportPNG} style={btnGhost}>⬇ PNG</button>
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
                      <Draggable key={w.id} draggableId={w.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...card,
                              opacity: snapshot.isDragging ? 0.85 : 1,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span {...provided.dragHandleProps} style={{ cursor: 'grab', color: '#3d5068', fontSize: '16px' }}>⠿</span>
                                <span style={{ fontSize: '14px', fontWeight: 500, color: '#e8eaf0' }}>{w.title}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => duplicateWidget(w)} style={btnGhost}>Duplicar</button>
                                <button onClick={() => setEditing(editing === w.id ? null : w.id)} style={btnGhost}>
                                  {editing === w.id ? 'Fechar' : 'Editar'}
                                </button>
                                <button onClick={() => removeWidget(w.id)} style={{ ...btnGhost, color: '#f87171', borderColor: 'rgba(248,113,113,0.2)' }}>
                                  Remover
                                </button>
                              </div>
                            </div>

                            {editing === w.id && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '1rem', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px' }}>TÍTULO</label>
                                  <input value={w.title} onChange={e => updateWidget(w.id, { title: e.target.value })}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(100,160,255,0.2)', borderRadius: '6px', padding: '6px 8px', fontSize: '12px', color: '#e8eaf0' }} />
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px' }}>TIPO</label>
                                  <select value={w.type} onChange={e => updateWidget(w.id, { type: e.target.value as ChartType })}
                                    style={{ width: '100%', background: '#0d1929', border: '1px solid rgba(100,160,255,0.2)', borderRadius: '6px', padding: '6px 8px', fontSize: '12px', color: '#e8eaf0' }}>
                                    {CHART_TYPES.map(ct => <option key={ct.type} value={ct.type}>{ct.label}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px' }}>EIXO X</label>
                                  <select value={w.xKey} onChange={e => updateWidget(w.id, { xKey: e.target.value })}
                                    style={{ width: '100%', background: '#0d1929', border: '1px solid rgba(100,160,255,0.2)', borderRadius: '6px', padding: '6px 8px', fontSize: '12px', color: '#e8eaf0' }}>
                                    {dataset.columns.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px' }}>EIXO Y</label>
                                  <select value={w.yKey} onChange={e => updateWidget(w.id, { yKey: e.target.value })}
                                    style={{ width: '100%', background: '#0d1929', border: '1px solid rgba(100,160,255,0.2)', borderRadius: '6px', padding: '6px 8px', fontSize: '12px', color: '#e8eaf0' }}>
                                    {dataset.columns.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px' }}>COR</label>
                                  <input type="color" value={w.color} onChange={e => updateWidget(w.id, { color: e.target.value })}
                                    style={{ width: '100%', height: '32px', background: 'none', border: '1px solid rgba(100,160,255,0.2)', borderRadius: '6px', cursor: 'pointer' }} />
                                </div>
                              </div>
                            )}

                            {renderChart(w)}
                          </div>
                        )}
                      </Draggable>
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