import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import Navbar from '@/components/Navbar'
import StatCard from '@/components/StatCard'

interface ActivityItem {
  id: string
  type: 'created' | 'exported' | 'opened'
  label: string
  sub: string
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { history } = useData()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [saved, setSaved] = useState(false)
  const [exportCount] = useState(() => Math.floor(Math.random() * 10))

  const totalWidgets = history.reduce((acc, d) => acc + d.widgets.length, 0)
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U'

  const activity: ActivityItem[] = history.slice(0, 5).map(d => ({
    id: d.id,
    type: 'created',
    label: 'Dashboard criado',
    sub: `${d.name} · ${new Date(d.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
  }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const card = {
    background: 'rgba(13, 25, 45, 0.85)',
    border: '1px solid rgba(100, 160, 255, 0.2)',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '1rem',
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(100, 160, 255, 0.2)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#e8eaf0',
    fontFamily: 'Segoe UI, sans-serif',
    marginBottom: '12px',
  }

  const labelStyle = {
    fontSize: '11px', color: '#7a8fa6',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px', marginBottom: '6px', display: 'block',
  }

  const dotColor = (type: ActivityItem['type']) => {
    if (type === 'created') return '#4d9de0'
    if (type === 'exported') return '#6ac96a'
    return '#a97df7'
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#e8eaf0', margin: 0 }}>Perfil</h1>
            <p style={{ fontSize: '13px', color: '#7a8fa6', marginTop: '4px' }}>Suas informações e atividade</p>
          </div>

          <div style={{ ...card, display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1565c0, #4d9de0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: 600, color: '#fff', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '20px', fontWeight: 500, color: '#e8eaf0', margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: '13px', color: '#7a8fa6', marginTop: '3px' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(77,157,224,0.1)', border: '1px solid rgba(77,157,224,0.2)', color: '#4d9de0' }}>
                  Usuário ativo
                </span>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(100,200,100,0.1)', border: '1px solid rgba(100,200,100,0.2)', color: '#6ac96a' }}>
                  Sessão atual
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            <StatCard label="Dashboards" value={history.length} />
            <StatCard label="Datasets" value={history.length} />
            <StatCard label="Gráficos" value={totalWidgets} />
            <StatCard label="Exportações" value={exportCount} color="#6ac96a" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={card}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#e8eaf0', marginBottom: '1rem' }}>
                Informações pessoais
              </p>
              <label style={labelStyle}>Nome</label>
              <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
              <label style={labelStyle}>E-mail</label>
              <input value={user?.email ?? ''} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
              <label style={labelStyle}>Membro desde</label>
              <input
                value={new Date(user?.createdAt ?? '').toLocaleDateString('pt-BR')}
                disabled
                style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }}
              />
              <button onClick={handleSave} style={{
                background: saved ? 'rgba(100,200,100,0.15)' : 'linear-gradient(90deg, #1565c0, #1976d2)',
                color: saved ? '#6ac96a' : '#fff',
                border: saved ? '1px solid rgba(100,200,100,0.3)' : 'none',
                borderRadius: '6px', padding: '9px 20px',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              }}>
                {saved ? '✓ Salvo' : 'Salvar alterações'}
              </button>
            </div>

            <div style={{ ...card, marginBottom: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#e8eaf0', marginBottom: '1rem' }}>
                Atividade recente
              </p>
              {activity.length === 0 ? (
                <div>
                  <p style={{ fontSize: '13px', color: '#3d5068' }}>Nenhuma atividade ainda.</p>
                  <button onClick={() => navigate('/')} style={{
                    marginTop: '8px', fontSize: '12px', padding: '6px 14px',
                    borderRadius: '6px', cursor: 'pointer',
                    border: '1px solid rgba(100,160,255,0.2)',
                    background: 'transparent', color: '#4d9de0',
                  }}>
                    Criar primeiro dashboard
                  </button>
                </div>
              ) : (
                activity.map((item, i) => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 0',
                    borderBottom: i < activity.length - 1 ? '1px solid rgba(100,160,255,0.08)' : 'none',
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor(item.type), flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '13px', color: '#c8cdd6', margin: 0 }}>{item.label}</p>
                      <p style={{ fontSize: '11px', color: '#3d5068', marginTop: '2px' }}>{item.sub}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={card}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#e8eaf0', marginBottom: '1rem' }}>
              Segurança e sessão
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{
                fontSize: '13px', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer',
                border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#7a8fa6',
              }}>
                Alterar senha
              </button>
              <button onClick={handleLogout} style={{
                fontSize: '13px', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer',
                border: '1px solid rgba(248,113,113,0.2)', background: 'transparent', color: '#f87171',
              }}>
                Sair da conta
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}