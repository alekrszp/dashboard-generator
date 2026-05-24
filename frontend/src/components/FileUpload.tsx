import { useRef } from 'react'

interface FileUploadProps {
  fileName: string
  onFile: (file: File) => void
}

export default function FileUpload({ fileName, onFile }: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        style={{
          border: '1px dashed rgba(100,160,255,0.3)', borderRadius: '10px',
          padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer',
          background: 'rgba(13,25,45,0.5)',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(100,160,255,0.6)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(100,160,255,0.3)'}
      >
        <div style={{
          width: '40px', height: '40px', borderRadius: '8px',
          background: 'rgba(77,157,224,0.15)',
          border: '1px solid rgba(77,157,224,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px',
          fontSize: '18px', color: '#4d9de0',
        }}>
          ↑
        </div>
        <p style={{ fontSize: '14px', color: '#7a8fa6', margin: 0 }}>
          {fileName || 'Clique ou arraste seu arquivo aqui'}
        </p>
        <span style={{ fontSize: '12px', color: '#3d5068', marginTop: '6px', display: 'block' }}>
          CSV, TXT, XLSX, XLS
        </span>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.xlsx,.xls,.txt"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  )
}