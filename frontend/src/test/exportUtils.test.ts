import { describe, it, expect } from 'vitest'

describe('exportUtils', () => {
  it('módulo existe', async () => {
    const mod = await import('../../src/utils/exportUtils')
    expect(typeof mod.exportToCSV).toBe('function')
    expect(typeof mod.exportToPNG).toBe('function')
  })
})