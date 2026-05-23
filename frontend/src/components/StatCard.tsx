interface StatCardProps {
  label: string
  value: number | string
  color?: string
}

export default function StatCard({ label, value, color = '#4d9de0' }: StatCardProps) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(100,160,255,0.15)',
      borderRadius: '8px', padding: '1rem', textAlign: 'center',
    }}>
      <p style={{ fontSize: '24px', fontWeight: 500, color, margin: 0 }}>{value}</p>
      <p style={{ fontSize: '12px', color: '#7a8fa6', marginTop: '4px' }}>{label}</p>
    </div>
  )
}