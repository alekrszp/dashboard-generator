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
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'linear-gradient(135deg, #1565c0, #4d9de0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700, color: '#fff',
          }}>D</div>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#e8eaf0', whiteSpace: 'nowrap' }}>
            Dashboard Generator
          </span>
        </div>

        {/* Desktop nav — hidden on mobile via inline media not possible, use className trick */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {['/', '/history'].map((path, i) => (
            <button key={path} onClick={() => navigate(path)} style={{
              fontSize: '13px', padding: '5px 12px', borderRadius: '6px',
              border: `1px solid ${isActive(path) ? 'rgba(100,160,255,0.3)' : 'transparent'}`,
              background: 'transparent',
              color: isActive(path) ? '#e8eaf0' : '#7a8fa6',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {i === 0 ? 'Novo' : 'Meus Dashboards'}
            </button>
          ))}
          <span
            onClick={() => navigate('/profile')}
            style={{ fontSize: '13px', color: '#7a8fa6', cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: '4px' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8eaf0'}
            onMouseLeave={e => e.currentTarget.style.color = '#7a8fa6'}
          >
            {user?.name}
          </span>
          <button onClick={handleLogout} style={{
            fontSize: '13px', padding: '5px 12px', borderRadius: '6px',
            border: '1px solid rgba(100,160,255,0.2)',
            background: 'transparent', color: '#7a8fa6', cursor: 'pointer',
          }}>
            Sair
          </button>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="nav-mobile"
          onClick={() => setMenuOpen(o => !o)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#7a8fa6', fontSize: '22px', padding: '4px',
            lineHeight: 1, flexShrink: 0,
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="nav-mobile" style={{
          borderTop: '1px solid rgba(100,160,255,0.1)',
          padding: '0.75rem 1rem',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {[
            { path: '/', label: 'Novo dashboard' },
            { path: '/history', label: 'Meus Dashboards' },
            { path: '/profile', label: user?.name ?? 'Perfil' },
          ].map(({ path, label }) => (
            <button key={path} onClick={() => { navigate(path); setMenuOpen(false) }} style={{
              fontSize: '14px', padding: '10px 14px', borderRadius: '6px',
              border: `1px solid ${isActive(path) ? 'rgba(100,160,255,0.3)' : 'rgba(100,160,255,0.1)'}`,
              background: isActive(path) ? 'rgba(100,160,255,0.08)' : 'transparent',
              color: isActive(path) ? '#e8eaf0' : '#7a8fa6',
              cursor: 'pointer', textAlign: 'left',
            }}>
              {label}
            </button>
          ))}
          <button onClick={handleLogout} style={{
            fontSize: '14px', padding: '10px 14px', borderRadius: '6px',
            border: '1px solid rgba(248,113,113,0.2)',
            background: 'transparent', color: '#f87171',
            cursor: 'pointer', textAlign: 'left',
          }}>
            Sair da conta
          </button>
        </div>
      )}

      <style>{`
        .nav-mobile { display: none !important; }
        .nav-desktop { display: flex !important; }
        @media (max-width: 640px) {
          .nav-mobile { display: flex !important; }
          .nav-desktop { display: none !important; }
        }
      `}</style>
    </div>
  )
}