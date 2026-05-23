import { describe, it, expect } from 'vitest'
import { formatDate, formatTime } from '../../src/utils/formatters'

describe('formatters', () => {
  it('formatDate retorna string', () => {
    expect(typeof formatDate('2026-01-15T00:00:00.000Z')).toBe('string')
  })

  it('formatTime retorna string', () => {
    expect(typeof formatTime('2026-01-15T14:30:00.000Z')).toBe('string')
  })
})