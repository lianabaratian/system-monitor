import { describe, it, expect } from 'vitest'
import { formatBytes, formatPercent } from './format'

describe('formatBytes', () => {
  it('handles zero and negatives', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(-5)).toBe('0 B')
  })
  it('formats across units', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB')
    expect(formatBytes(1024 ** 3)).toBe('1.0 GB')
  })
})

describe('formatPercent', () => {
  it('rounds to one decimal with a % sign', () => {
    expect(formatPercent(15.844)).toBe('15.8%')
    expect(formatPercent(100)).toBe('100.0%')
  })
})