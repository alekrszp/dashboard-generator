interface EmptyStateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div style={{
      background: 'rgba(13, 25, 45, 0.85)',
      border: '1px dashed rgba(100, 160, 255, 0.2)',
      borderRadius: '10px', padding: '4rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '40px', marginBottom: '1rem' }}>📊</div>
      <p style={{ color: '#7a8fa6', fontSize: '14px', marginBottom: '1rem' }}>{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} style={{
          fontSize: '13px', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
          border: '1px solid rgba(100,160,255,0.2)',
          background: 'transparent', color: '#4d9de0',
        }}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}