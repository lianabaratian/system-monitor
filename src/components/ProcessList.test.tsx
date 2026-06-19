import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProcessList } from './ProcessList'
import { systemApi } from '../api/systemApi'

vi.mock('../api/systemApi', () => ({
  systemApi: {
    getOsInfo: vi.fn(),
    getProcesses: vi.fn(),
    getMemoryInfo: vi.fn(),
    getDiskInfo: vi.fn(),
  },
}))

const sample = [
  { pid: 1, name: 'alpha', cpu: 10, memory: 1 },
  { pid: 2, name: 'beta', cpu: 50, memory: 2 },
  { pid: 3, name: 'gamma', cpu: 5, memory: 3 },
]

describe('ProcessList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(systemApi.getProcesses).mockResolvedValue(sample)
  })

  it('renders the process rows', async () => {
    render(<ProcessList />)
    expect(await screen.findByText('alpha')).toBeInTheDocument()
    expect(screen.getByText('beta')).toBeInTheDocument()
    expect(screen.getByText('3 processes')).toBeInTheDocument()
  })

  it('filters processes by the search box', async () => {
    render(<ProcessList />)
    await screen.findByText('alpha')
    await userEvent.type(screen.getByLabelText('Filter processes by name'), 'bet')
    expect(screen.getByText('beta')).toBeInTheDocument()
    expect(screen.queryByText('alpha')).not.toBeInTheDocument()
  })

  it('changes the refresh interval', async () => {
    render(<ProcessList />)
    await screen.findByText('alpha')
    const select = screen.getByLabelText<HTMLSelectElement>('Refresh interval')
    await userEvent.selectOptions(select, '1000')
    expect(select.value).toBe('1000')
  })

  it('shows an error message when the fetch fails', async () => {
    vi.mocked(systemApi.getProcesses).mockRejectedValue(new Error('failed'))
    render(<ProcessList />)
    expect(await screen.findByText('failed')).toBeInTheDocument()
  })
})