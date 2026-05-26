import { describe, it, expect, vi } from 'vitest'
import { exportToCSV } from '../utils/exportUtils'

describe('exportToCSV', () => {
  it('gera e dispara download do CSV', () => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock')
    const anchor = document.createElement('a')
    vi.spyOn(document, 'createElement').mockReturnValueOnce(anchor)
    vi.spyOn(anchor, 'click').mockImplementation(vi.fn())

    exportToCSV(['Nome', 'Valor'], [{ Nome: 'A', Valor: 10 }], 'teste')

    expect(anchor.download).toBe('teste.csv')
  })

  it('não lança erro com valores nulos', () => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock')
    const anchor = document.createElement('a')
    vi.spyOn(document, 'createElement').mockReturnValueOnce(anchor)
    vi.spyOn(anchor, 'click').mockImplementation(vi.fn())

    expect(() => exportToCSV(['Col'], [{ Col: null }], 'test')).not.toThrow()
  })
})