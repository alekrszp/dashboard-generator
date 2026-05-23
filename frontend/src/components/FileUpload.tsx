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
        }}
      >
        <div style={{ fontSize: '32px', color: '#4d9de0', marginBottom: '12px' }}>📂</div>
        <p style={{ fontSize: '14px', color: '#7a8fa6' }}>
          {fileName || 'Clique ou arraste seu arquivo aqui'}
        </p>
        <span style={{ fontSize: '12px', color: '#3d5068', marginTop: '4px', display: 'block' }}>
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