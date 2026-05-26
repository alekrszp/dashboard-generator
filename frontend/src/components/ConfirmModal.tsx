interface ConfirmModalProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'rgba(13,25,45,0.98)',
        border: '1px solid rgba(100,160,255,0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        maxWidth: '380px', width: '100%',
        maxHeight: '90vh',
      }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #1565c0, #4d9de0)' }} />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#e8eaf0', marginBottom: '0.5rem', fontWeight: 500 }}>
            Confirmar ação
          </p>
          <p style={{ fontSize: '13px', color: '#7a8fa6', marginBottom: '1.5rem' }}>
            {message}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onCancel} style={{
              fontSize: '13px', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
              border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#7a8fa6',
            }}>
              Cancelar
            </button>
            <button onClick={onConfirm} style={{
              fontSize: '13px', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
              border: 'none', background: 'linear-gradient(90deg, #c62828, #e53935)', color: '#fff',
            }}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}