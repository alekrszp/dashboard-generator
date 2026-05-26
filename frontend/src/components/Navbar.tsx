import { useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { loadDashboard, dataset } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const savedDash = id && id !== 'new' ? loadDashboard(id) : null
  const dashName = savedDash?.name ?? (location.pathname.includes('/dashboard') ? dataset?.name : null)

  const isActive = (path: string) => location.pathname === path

  const navBtn = (path: string, label: string) => (
    <button
      onClick={() => { navigate(path); setMenuOpen(false) }}
      style={{
        fontSize: '13px', padding: '8px 14px', borderRadius: '6px',
        border: `1px solid ${isActive(path) ? 'rgba(100,160,255,0.3)' : 'transparent'}`,
        background: 'transparent',
        color: isActive(path) ? '#e8eaf0' : '#7a8fa6',
        cursor: 'pointer', textAlign: 'left', width: '100%',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10, 18, 35, 0.95)',
      borderBottom: '1px solid rgba(100, 160, 255, 0.15)',
      backdropFilter: 'blur(10px)',
    }}>
      {/* Main bar */}
      <div style={{
        padding: '0 1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '52px', gap: '8px',
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'linear-gradient(135deg, #1565c0, #4d9de0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>D</div>
          <span style={{
            fontSize: '15px', fontWeight: 500, color: '#e8eaf0',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: '160px',
          }}>
            Dashboard Generator
          </span>
        </div>

        {/* Breadcrumb */}
        {dashName && (
          <span style={{
            fontSize: '12px', color: '#4d9de0',
            background: 'rgba(77,157,224,0.1)',
            border: '1px solid rgba(77,157,224,0.2)',
            padding: '3px 8px', borderRadius: '20px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: '120px', flexShrink: 1,
          }}>
            {dashName}
          </span>
        )}

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              fontSize: '13px', padding: '5px 12px', borderRadius: '6px',
              border: `1px solid ${isActive('/') ? 'rgba(100,160,255,0.3)' : 'transparent'}`,
              background: 'transparent',
              color: isActive('/') ? '#e8eaf0' : '#7a8fa6',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Novo
          </button>
          <button
            onClick={() => navigate('/history')}
            style={{
              fontSize: '13px', padding: '5px 12px', borderRadius: '6px',
              border: `1px solid ${isActive('/history') ? 'rgba(100,160,255,0.3)' : 'transparent'}`,
              background: 'transparent',
              color: isActive('/history') ? '#e8eaf0' : '#7a8fa6',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Meus Dashboards
          </button>
        </div>

        {/* User + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span
            onClick={() => navigate('/profile')}
            style={{
              fontSize: '13px', color: '#7a8fa6', cursor: 'pointer',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: '100px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8eaf0'}
            onMouseLeave={e => e.currentTarget.style.color = '#7a8fa6'}
          >
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            style={{
              fontSize: '13px', padding: '5px 12px', borderRadius: '6px',
              border: '1px solid rgba(100,160,255,0.2)',
              background: 'transparent', color: '#7a8fa6', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Sair
          </button>
          {/* Hamburger — visible on very small screens */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'none',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#7a8fa6', fontSize: '20px', padding: '4px',
            }}
            className="hamburger"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid rgba(100,160,255,0.1)',
          padding: '0.5rem 1rem 1rem',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {navBtn('/', 'Novo dashboard')}
          {navBtn('/history', 'Meus Dashboards')}
          {navBtn('/profile', user?.name ?? 'Perfil')}
          <button
            onClick={handleLogout}
            style={{
              fontSize: '13px', padding: '8px 14px', borderRadius: '6px',
              border: '1px solid rgba(248,113,113,0.2)', background: 'transparent',
              color: '#f87171', cursor: 'pointer', textAlign: 'left', width: '100%',
            }}
          >
            Sair da conta
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .hamburger { display: block !important; }
        }
        @media (max-width: 600px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </div>
  )
}