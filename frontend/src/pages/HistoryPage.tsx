import { useNavigate } from 'react-router-dom'
import { useData, SavedDashboard } from '@/hooks/useData'
import { deleteDashboardOnAPI } from '@/services/dataService'
import { formatDateTime } from '@/utils/formatters'
import Navbar from '@/components/Navbar'

export default function HistoryPage() {
  const { history, historyLoading, historyError, setDataset, deleteDashboard } = useData()
  const navigate = useNavigate()

  const handleOpen = (dash: SavedDashboard) => {
    setDataset(dash.dataset)
    navigate(`/dashboard/${dash.id}`, { state: { widgets: dash.widgets, fromHistory: true } })
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteDashboard(id)
    try { await deleteDashboardOnAPI(id) } catch { /* silently fail — já removeu do estado */ }
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '1.5rem 1rem', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#e8eaf0', margin: 0 }}>
                Meus Dashboards
              </h1>
              <p style={{ fontSize: '13px', color: '#7a8fa6', marginTop: '4px' }}>
                {historyLoading ? 'Carregando...' : `${history.length} dashboard${history.length !== 1 ? 's' : ''} salvos`}
              </p>
            </div>
            <button onClick={() => navigate('/')} style={{
              background: 'linear-gradient(90deg, #1565c0, #1976d2)',
              color: '#fff', border: 'none', borderRadius: '6px',
              padding: '9px 20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            }}>
              Novo dashboard
            </button>
          </div>

          {historyError && (
            <div style={{
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '8px', padding: '12px 16px',
              marginBottom: '1rem', fontSize: '13px', color: '#f87171',
            }}>
              ⚠️ {historyError}
            </div>
          )}

          {historyLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#7a8fa6', fontSize: '14px' }}>
              Carregando dashboards...
            </div>
          ) : history.length === 0 ? (
            <div style={{
              background: 'rgba(13, 25, 45, 0.85)',
              border: '1px dashed rgba(100, 160, 255, 0.2)',
              borderRadius: '10px', padding: '4rem',
              textAlign: 'center',
            }}>
              <p style={{ color: '#7a8fa6', fontSize: '14px', marginBottom: '1rem' }}>
                Nenhum dashboard criado ainda.
              </p>
              <button onClick={() => navigate('/')} style={{
                fontSize: '13px', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
                border: '1px solid rgba(100,160,255,0.2)',
                background: 'transparent', color: '#4d9de0',
              }}>
                Criar meu primeiro dashboard
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {history.map(dash => (
                <div
                  key={dash.id}
                  onClick={() => handleOpen(dash)}
                  style={{
                    background: 'rgba(13, 25, 45, 0.85)',
                    border: '1px solid rgba(100, 160, 255, 0.2)',
                    borderRadius: '10px', padding: '1.25rem',
                    cursor: 'pointer', transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(100,160,255,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(100,160,255,0.2)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '15px', fontWeight: 500, color: '#e8eaf0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {dash.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#7a8fa6', marginTop: '3px' }}>
                        {formatDateTime(dash.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={e => handleDelete(dash.id, e)}
                      style={{
                        fontSize: '11px', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer',
                        border: '1px solid rgba(248,113,113,0.2)', background: 'transparent', color: '#f87171',
                        flexShrink: 0,
                      }}
                    >
                      Excluir
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(77,157,224,0.1)', border: '1px solid rgba(77,157,224,0.2)', color: '#4d9de0' }}>
                      {dash.dataset.rows.length} linhas
                    </span>
                    <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(77,157,224,0.1)', border: '1px solid rgba(77,157,224,0.2)', color: '#4d9de0' }}>
                      {dash.dataset.columns.length} colunas
                    </span>
                    <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(100,200,100,0.1)', border: '1px solid rgba(100,200,100,0.2)', color: '#6ac96a' }}>
                      {dash.widgets.length} gráfico{dash.widgets.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {dash.dataset.columns.map(col => (
                      <span key={col} style={{
                        fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(100,160,255,0.15)',
                        color: '#7a8fa6',
                      }}>
                        {col}
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: '12px', textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#4d9de0' }}>Abrir →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}