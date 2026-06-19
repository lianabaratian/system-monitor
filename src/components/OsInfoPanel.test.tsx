import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OsInfoPanel } from './OsInfoPanel'
import { systemApi } from '../api/systemApi'

vi.mock('../api/systemApi', () => ({
  systemApi: {
    getOsInfo: vi.fn(),
    getProcesses: vi.fn(),
    getMemoryInfo: vi.fn(),
    getDiskInfo: vi.fn(),
  },
}))

describe('OsInfoPanel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows loading, then renders OS info', async () => {
    vi.mocked(systemApi.getOsInfo).mockResolvedValue({
      platform: 'darwin', distro: 'macOS', release: '14.0',
      arch: 'arm64', hostname: 'mac', username: 'liana',
    })
    render(<OsInfoPanel />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(await screen.findByText('macOS')).toBeInTheDocument()
    expect(screen.getByText('arm64')).toBeInTheDocument()
    expect(screen.getByText('liana')).toBeInTheDocument()
  })

  it('shows an error message when the fetch fails', async () => {
    vi.mocked(systemApi.getOsInfo).mockRejectedValue(new Error('nope'))
    render(<OsInfoPanel />)
    expect(await screen.findByText('nope')).toBeInTheDocument()
  })
})