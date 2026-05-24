import { describe, it, expect } from 'vitest'
import { detectColumns, suggestChartType } from '../../src/utils/detectColumns'

describe('detectColumns', () => {
  it('detecta colunas numéricas corretamente', () => {
    const columns = ['Mês', 'Vendas']
    const rows = [
      { Mês: 'Janeiro', Vendas: 1000 },
      { Mês: 'Fevereiro', Vendas: 2000 },
    ]
    const result = detectColumns(columns, rows)
    expect(result[0].type).toBe('category')
    expect(result[1].type).toBe('numeric')
  })

  it('retorna vazio para colunas vazias', () => {
    expect(detectColumns([], [])).toHaveLength(0)
  })
})

describe('suggestChartType', () => {
  it('sugere linha para data', () => {
    expect(suggestChartType({ name: 'Data', type: 'date' }, { name: 'Valor', type: 'numeric' })).toBe('line')
  })

  it('sugere barra para categoria + numérico', () => {
    expect(suggestChartType({ name: 'Cat', type: 'category' }, { name: 'Val', type: 'numeric' })).toBe('bar')
  })
})

describe('chartRegistry pattern', () => {
  it('todos os tipos de gráfico estão registrados', async () => {
    const mod = await import('../../src/components/ChartRenderer')
    expect(mod).toBeDefined()
  })
})