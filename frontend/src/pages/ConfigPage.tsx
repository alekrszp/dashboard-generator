import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useData } from '@/hooks/useData'
import { Widget, ChartType } from '@/types'
import { detectColumns, suggestChartType } from '@/utils/detectColumns'
import Navbar from '@/components/Navbar'

const CHART_OPTIONS: { type: ChartType; label: string; desc: string }[] = [
  { type: 'bar',   label: 'Barra',   desc: 'Comparar valores entre categorias' },
  { type: 'line',  label: 'Linha',   desc: 'Mostrar tendência ao longo do tempo' },
  { type: 'pie',   label: 'Pizza',   desc: 'Mostrar proporção do total' },
  { type: 'table', label: 'Tabela',  desc: 'Visualizar todos os dados' },
  { type: 'area',  label: 'Área',    desc: 'Tendência com volume acumulado' },
  { type: 'radar', label: 'Radar',   desc: 'Comparar múltiplas métricas' },
]

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(100, 160, 255, 0.2)',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: '13px',
  color: '#e8eaf0',
  width: '100%',
  boxSizing: 'border-box' as const,
}

const card = {
  background: 'rgba(13, 25, 45, 0.85)',
  border: '1px solid rgba(100, 160, 255, 0.2)',
  borderRadius: '10px',
  padding: '1.5rem',
  marginBottom: '1rem',
}

export default function ConfigPage() {
  const { dataset, updateDashboard } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const dashboardId = location.state?.dashboardId

  const colInfos = dataset ? detectColumns(dataset.columns, dataset.rows) : []
  const numericCols = colInfos.filter(c => c.type === 'numeric')
  const categoryCols = colInfos.filter(c => c.type !== 'numeric')
  const defaultXKey = categoryCols[0]?.name ?? dataset?.columns[0] ?? ''

  const [widgets, setWidgets] = useState<Widget[]>(() => {
    if (location.state?.widgets) return location.state.widgets
    if (!dataset) return []
    return numericCols.map((col, i) => {
      const xCol = categoryCols[0] ?? colInfos[0]
      const suggested = suggestChartType(xCol, col) as ChartType
      return {
        id: String(i),
        type: suggested,
        title: `${col.name} por ${xCol?.name ?? ''}`,
        xKey: xCol?.name ?? dataset.columns[0],
        yKey: col.name,
        color: ['#4d9de0', '#1976d2', '#64b5f6', '#0d47a1'][i % 4],
      }
    })
  })

  if (!dataset) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <p style={{ color: '#7a8fa6', textAlign: 'center' }}>
          Nenhum dado encontrado.{' '}
          <span style={{ color: '#4d9de0', cursor: 'pointer' }} onClick={() => navigate('/')}>
            Voltar
          </span>
        </p>
      </div>
    )
  }

  const updateWidget = (id: string, changes: Partial<Widget>) =>
    setWidgets(ws => ws.map(w => w.id === id ? { ...w, ...changes } : w))

  const removeWidget = (id: string) =>
    setWidgets(ws => ws.filter(w => w.id !== id))

  const addWidget = () => {
    setWidgets(ws => [...ws, {
      id: Date.now().toString(),
      type: 'bar',
      title: 'Novo gráfico',
      xKey: defaultXKey,
      yKey: numericCols[0]?.name ?? dataset.columns[0],
      color: '#4d9de0',
    }])
  }

  const handleGenerate = () => {
    if (!widgets.length) return alert('Adicione pelo menos um gráfico!')
    if (dashboardId && dashboardId !== 'new') {
      updateDashboard(dashboardId, widgets)
      navigate(`/dashboard/${dashboardId}`, { state: { widgets, fromHistory: true } })
    } else {
      navigate('/dashboard/new', { state: { widgets } })
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '1.5rem 1rem', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#e8eaf0', margin: 0 }}>
              Configurar dashboard
            </h1>
            <p style={{ fontSize: '13px', color: '#7a8fa6', marginTop: '4px' }}>
              Dataset: <span style={{ color: '#4d9de0' }}>{dataset.name}</span> —{' '}
              {dataset.rows.length} linhas · {dataset.columns.length} colunas
            </p>
          </div>

          <div style={card}>
            <p style={{ fontSize: '12px', color: '#7a8fa6', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Colunas detectadas
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {colInfos.map(col => (
                <span key={col.name} style={{
                  fontSize: '12px', padding: '4px 10px', borderRadius: '20px',
                  background: col.type === 'numeric' ? 'rgba(77,157,224,0.15)' : col.type === 'date' ? 'rgba(100,200,100,0.15)' : 'rgba(150,100,255,0.15)',
                  color: col.type === 'numeric' ? '#4d9de0' : col.type === 'date' ? '#6ac96a' : '#a97df7',
                  border: `1px solid ${col.type === 'numeric' ? 'rgba(77,157,224,0.3)' : col.type === 'date' ? 'rgba(100,200,100,0.3)' : 'rgba(150,100,255,0.3)'}`,
                }}>
                  {col.name} · {col.type === 'numeric' ? 'numérico' : col.type === 'date' ? 'data' : 'categoria'}
                </span>
              ))}
            </div>
          </div>

          {widgets.map((w, idx) => (
            <div key={w.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#e8eaf0' }}>
                  Gráfico {idx + 1}
                </span>
                <button onClick={() => removeWidget(w.id)} style={{
                  fontSize: '12px', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
                  border: '1px solid rgba(248,113,113,0.2)', background: 'transparent', color: '#f87171',
                }}>
                  Remover
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Título</label>
                  <input value={w.title} onChange={e => updateWidget(w.id, { title: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Cor</label>
                  <input
                    type="color" value={w.color}
                    onChange={e => updateWidget(w.id, { color: e.target.value })}
                    style={{ ...inputStyle, height: '34px', padding: '2px 6px', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Eixo X</label>
                  <select value={w.xKey} onChange={e => updateWidget(w.id, { xKey: e.target.value })} style={inputStyle}>
                    {dataset.columns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Eixo Y</label>
                  <select value={w.yKey} onChange={e => updateWidget(w.id, { yKey: e.target.value })} style={inputStyle}>
                    {dataset.columns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#7a8fa6', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Tipo de visualização
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {CHART_OPTIONS.map(opt => (
                    <div
                      key={opt.type}
                      onClick={() => updateWidget(w.id, { type: opt.type })}
                      style={{
                        padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                        border: w.type === opt.type ? '1px solid rgba(77,157,224,0.6)' : '1px solid rgba(100,160,255,0.15)',
                        background: w.type === opt.type ? 'rgba(77,157,224,0.1)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <p style={{ fontSize: '13px', fontWeight: 500, color: w.type === opt.type ? '#4d9de0' : '#e8eaf0', margin: 0 }}>
                        {opt.label}
                      </p>
                      <p style={{ fontSize: '11px', color: '#7a8fa6', margin: '2px 0 0' }}>
                        {opt.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button onClick={addWidget} style={{
            width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer',
            border: '1px dashed rgba(100,160,255,0.3)', background: 'transparent',
            color: '#7a8fa6', fontSize: '13px', marginBottom: '1.5rem',
          }}>
            + Adicionar gráfico
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <button onClick={() => navigate('/')} style={{
              fontSize: '13px', padding: '9px 20px', borderRadius: '6px', cursor: 'pointer',
              border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#7a8fa6',
            }}>
              ← Voltar
            </button>
            <button onClick={handleGenerate} style={{
              background: 'linear-gradient(90deg, #1565c0, #1976d2)',
              color: '#fff', border: 'none', borderRadius: '6px',
              padding: '10px 24px', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            }}>
              Gerar Dashboard →
            </button>
          </div>

        </div>
      </div>
    </>
  )
}