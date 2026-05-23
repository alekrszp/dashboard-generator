import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { loadDashboard, dataset } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const savedDash = id && id !== 'new' ? loadDashboard(id) : null
  const dashName = savedDash?.name ?? (location.pathname.includes('/dashboard') ? dataset?.name : null)

  const navLink = (path: string, label: string) => (
    <button onClick={() => navigate(path)} style={{
      fontSize: '13px', padding: '5px 14px', borderRadius: '6px',
      border: '1px solid transparent', background: 'transparent',
      color: location.pathname === path ? '#e8eaf0' : '#7a8fa6',
      borderColor: location.pathname === path ? 'rgba(100,160,255,0.3)' : 'transparent',
      cursor: 'pointer',
    }}>
      {label}
    </button>
  )

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10, 18, 35, 0.95)',
      borderBottom: '1px solid rgba(100, 160, 255, 0.15)',
      padding: '0 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '52px',
      backdropFilter: 'blur(10px)',
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'linear-gradient(135deg, #1565c0, #4d9de0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700, color: '#fff',
          }}>D</div>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#e8eaf0' }}>
            Dashboard Generator
          </span>
        </div>

        {dashName && (
          <>
            <span style={{ color: '#3d5068', fontSize: '16px' }}>/</span>
            <span style={{
              fontSize: '13px', color: '#4d9de0',
              background: 'rgba(77,157,224,0.1)',
              border: '1px solid rgba(77,157,224,0.2)',
              padding: '3px 10px', borderRadius: '20px',
              maxWidth: '200px', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {dashName}
            </span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {navLink('/', 'Novo')}
        {navLink('/history', 'Meus Dashboards')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span
          onClick={() => navigate('/profile')}
          style={{ fontSize: '13px', color: '#7a8fa6', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e8eaf0'}
          onMouseLeave={e => e.currentTarget.style.color = '#7a8fa6'}
        >
          {user?.name}
        </span>
        <button onClick={handleLogout} style={{
          fontSize: '13px', padding: '5px 14px', borderRadius: '6px',
          border: '1px solid rgba(100,160,255,0.2)',
          background: 'transparent', color: '#7a8fa6', cursor: 'pointer',
        }}>
          Sair
        </button>
      </div>
    </div>
  )
}