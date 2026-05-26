import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { useData } from '@/hooks/useData'
import { Dataset, DatasetRow } from '@/types'
import Navbar from '@/components/Navbar'
import FileUpload from '@/components/FileUpload'
import DataTable from '@/components/DataTable'
import ExampleModal from '@/components/ExampleModal'

type Tab = 'file' | 'manual'

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(100, 160, 255, 0.2)',
  borderRadius: '6px',
  padding: '7px 10px',
  fontSize: '13px',
  color: '#e8eaf0',
}

export default function DataInputPage() {
  const { setDataset, setCurrentDashboardId } = useData()
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('file')
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState<DatasetRow[]>([])
  const [allRows, setAllRows] = useState<DatasetRow[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [datasetName, setDatasetName] = useState('Meu Dataset')
  const [showExample, setShowExample] = useState(false)

  const [manualCols, setManualCols] = useState(['Categoria', 'Valor'])
  const [manualRows, setManualRows] = useState<string[][]>([['', ''], ['', ''], ['', '']])

  const parseFile = (file: File) => {
    setFileName(file.name)
    const name = file.name.toLowerCase()

    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const wb = XLSX.read(e.target?.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json<DatasetRow>(ws)
        const cols = data.length > 0 ? Object.keys(data[0]) : []
        setColumns(cols)
        setAllRows(data)
        setPreview(data.slice(0, 10))
      }
      reader.readAsBinaryString(file)
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        Papa.parse(text, {
          header: true, skipEmptyLines: true, dynamicTyping: true,
          complete: (result) => {
            const cols = result.meta.fields ?? []
            const rows = result.data as DatasetRow[]
            setColumns(cols)
            setAllRows(rows)
            setPreview(rows.slice(0, 10))
          },
        })
      }
      reader.readAsText(file)
    }
  }

  const addManualRow = () => setManualRows(r => [...r, manualCols.map(() => '')])
  const addManualCol = () => {
    setManualCols(c => [...c, `Coluna ${c.length + 1}`])
    setManualRows(r => r.map(row => [...row, '']))
  }
  const updateCell = (ri: number, ci: number, val: string) =>
    setManualRows(r => r.map((row, i) => i === ri ? row.map((c, j) => j === ci ? val : c) : row))
  const updateColName = (ci: number, val: string) =>
    setManualCols(c => c.map((col, i) => i === ci ? val : col))
  const removeRow = (ri: number) =>
    setManualRows(r => r.filter((_, i) => i !== ri))

  const handleGenerate = () => {
    let finalCols: string[]
    let finalRows: DatasetRow[]

    if (tab === 'file') {
      if (!columns.length) return alert('Importe um arquivo primeiro!')
      finalCols = columns
      finalRows = allRows
    } else {
      finalCols = manualCols
      finalRows = manualRows.map(row =>
        Object.fromEntries(manualCols.map((col, i) => [col, row[i] ?? '']))
      )
    }

    const dataset: Dataset = {
      id: Date.now().toString(),
      name: datasetName,
      columns: finalCols,
      rows: finalRows,
      createdAt: new Date().toISOString(),
    }

    setDataset(dataset)
    setCurrentDashboardId(null)
    navigate('/config')
  }

  const card = {
    background: 'rgba(13, 25, 45, 0.85)',
    border: '1px solid rgba(100, 160, 255, 0.2)',
    borderRadius: '10px',
    padding: '1.5rem',
  }

  return (
    <>
      <Navbar />

      {showExample && <ExampleModal onClose={() => setShowExample(false)} />}

      <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#e8eaf0', margin: 0 }}>
              Entrada de dados
            </h1>
            <p style={{ fontSize: '13px', color: '#7a8fa6', marginTop: '4px' }}>
              Importe um arquivo ou insira os dados manualmente
            </p>
          </div>

          <div style={{ ...card, marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: '#7a8fa6', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Nome do dataset
            </label>
            <input
              value={datasetName}
              onChange={e => setDatasetName(e.target.value)}
              style={{ ...inputStyle, marginTop: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            {(['file', 'manual'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '7px 18px', fontSize: '13px', borderRadius: '6px', cursor: 'pointer',
                border: '1px solid rgba(100,160,255,0.2)',
                background: tab === t ? 'rgba(100,160,255,0.15)' : 'transparent',
                color: tab === t ? '#e8eaf0' : '#7a8fa6',
              }}>
                {t === 'file' ? 'CSV / Excel / TXT' : 'Manual'}
              </button>
            ))}
          </div>

          {tab === 'file' && (
            <div style={card}>
              <FileUpload fileName={fileName} onFile={parseFile} />
              {preview.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ fontSize: '12px', color: '#7a8fa6', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Preview ({preview.length} de {allRows.length} linhas)
                  </p>
                  <DataTable columns={columns} rows={preview} />
                </div>
              )}
            </div>
          )}

          {tab === 'manual' && (
            <div style={card}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ fontSize: '13px', color: '#7a8fa6', margin: 0 }}>
                  Preencha as colunas e os dados
                </p>
                <button onClick={() => setShowExample(true)} style={{
                  fontSize: '12px', padding: '5px 14px', borderRadius: '6px', cursor: 'pointer',
                  border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#4d9de0',
                }}>
                  Como preencher?
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr>
                      {manualCols.map((col, ci) => (
                        <th key={ci} style={{ padding: '4px 6px', borderBottom: '1px solid rgba(100,160,255,0.15)' }}>
                          <input
                            value={col}
                            onChange={e => updateColName(ci, e.target.value)}
                            style={{ ...inputStyle, fontWeight: 500 }}
                          />
                        </th>
                      ))}
                      <th style={{ width: '36px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualRows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} style={{ padding: '4px 6px' }}>
                            <input
                              value={cell}
                              onChange={e => updateCell(ri, ci, e.target.value)}
                              style={inputStyle}
                            />
                          </td>
                        ))}
                        <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                          <button
                            onClick={() => removeRow(ri)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '16px' }}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                <button onClick={addManualRow} style={{
                  fontSize: '13px', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer',
                  border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#7a8fa6',
                }}>
                  + Linha
                </button>
                <button onClick={addManualCol} style={{
                  fontSize: '13px', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer',
                  border: '1px solid rgba(100,160,255,0.2)', background: 'transparent', color: '#7a8fa6',
                }}>
                  + Coluna
                </button>
              </div>

            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button onClick={handleGenerate} style={{
              background: 'linear-gradient(90deg, #1565c0, #1976d2)',
              color: '#fff', border: 'none', borderRadius: '6px',
              padding: '10px 24px', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            }}>
              Gerar Dashboard →
            </button>
          </div>

        </div>
      </div>
    </>
  )
}