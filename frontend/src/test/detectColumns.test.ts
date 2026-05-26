import { describe, it, expect } from 'vitest'
import { detectColumns, suggestChartType } from '../utils/detectColumns'

describe('detectColumns', () => {
  it('detecta numérico e categoria', () => {
    const result = detectColumns(['Mês', 'Vendas'], [
      { Mês: 'Janeiro', Vendas: 1000 },
      { Mês: 'Fevereiro', Vendas: 2000 },
    ])
    expect(result[0].type).toBe('category')
    expect(result[1].type).toBe('numeric')
  })

  it('retorna vazio para colunas vazias', () => {
    expect(detectColumns([], [])).toHaveLength(0)
  })

  it('detecta coluna de datas', () => {
    const result = detectColumns(['Data', 'Valor'], [
      { Data: '2026-01-01', Valor: 100 },
      { Data: '2026-02-01', Valor: 200 },
    ])
    expect(result[0].type).toBe('date')
  })
})

describe('suggestChartType', () => {
  it('sugere linha para data', () => {
    expect(suggestChartType({ name: 'Data', type: 'date' }, { name: 'Val', type: 'numeric' })).toBe('line')
  })

  it('sugere barra para categoria + numérico', () => {
    expect(suggestChartType({ name: 'Cat', type: 'category' }, { name: 'Val', type: 'numeric' })).toBe('bar')
  })
})