import { describe, it, expect } from 'vitest'
import { formatDate, formatTime, formatDateTime } from '../utils/formatters'

const iso = '2026-01-15T14:30:00.000Z'

describe('formatters', () => {
  it('formatDate retorna string no formato pt-BR', () => {
    expect(formatDate(iso)).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('formatTime retorna HH:MM', () => {
    expect(formatTime(iso)).toMatch(/\d{2}:\d{2}/)
  })

  it('formatDateTime combina data e hora com "às"', () => {
    expect(formatDateTime(iso)).toContain('às')
  })
})