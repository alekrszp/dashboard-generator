import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 500, color: '#e8eaf0', margin: 0 }}>
            Dashboard Generator
          </h1>
          <p style={{ fontSize: '13px', color: '#7a8fa6', marginTop: '5px' }}>
            Crie sua conta
          </p>
        </div>

        <div style={{
          background: 'rgba(13, 25, 45, 0.85)',
          border: '1px solid rgba(100, 160, 255, 0.2)',
          borderRadius: '10px',
          padding: '1.75rem',
        }}>
          {error && (
            <p style={{
              fontSize: '13px', color: '#f87171',
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.2)',
              borderRadius: '6px', padding: '8px 12px', marginBottom: '1rem',
            }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Nome', value: name, setter: setName, type: 'text', placeholder: 'Seu nome' },
              { label: 'E-mail', value: email, setter: setEmail, type: 'email', placeholder: 'seu@email.com' },
              { label: 'Senha', value: password, setter: setPassword, type: 'password', placeholder: 'Mínimo 6 caracteres' },
            ].map(({ label, value, setter, type, placeholder }) => (
              <div key={label} style={{ marginBottom: '1.1rem' }}>
                <label style={{
                  display: 'block', fontSize: '12px', fontWeight: 500,
                  color: '#7a8fa6', marginBottom: '6px',
                  letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={e => setter(e.target.value)}
                  required
                  minLength={type === 'password' ? 6 : undefined}
                  placeholder={placeholder}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(100, 160, 255, 0.2)',
                    borderRadius: '6px', padding: '9px 12px',
                    fontSize: '14px', color: '#e8eaf0',
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', marginTop: '4px',
                background: 'linear-gradient(90deg, #1565c0, #1976d2)',
                color: '#fff', border: 'none', borderRadius: '6px',
                padding: '10px', fontSize: '14px', fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                letterSpacing: '0.3px',
              }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#4a6080', marginTop: '1.25rem' }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: '#4d9de0', textDecoration: 'none' }}>
            Entrar
          </Link>
        </p>

      </div>
    </div>
  )
}