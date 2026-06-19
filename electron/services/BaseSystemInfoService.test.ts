import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('systeminformation', () => ({
  default: {
    osInfo: vi.fn(),
    processes: vi.fn(),
    mem: vi.fn(),
    fsSize: vi.fn(),
  },
}))

import si from 'systeminformation'
import { LinuxSystemInfoService } from './platforms/LinuxSystemInfoService'

const mockedSi = vi.mocked(si, true)

describe('BaseSystemInfoService (via LinuxSystemInfoService)', () => {
  const service = new LinuxSystemInfoService()

  beforeEach(() => vi.clearAllMocks())

  it('maps OS info from systeminformation', async () => {
    mockedSi.osInfo.mockResolvedValue({
      distro: 'Ubuntu', release: '22.04', arch: 'x64', hostname: 'box',
    } as never)
    const info = await service.getOsInfo()
    expect(info).toMatchObject({ distro: 'Ubuntu', release: '22.04', arch: 'x64', hostname: 'box' })
    expect(info.platform).toBe(process.platform)
  })

  it('maps processes to pid/name/cpu/memory', async () => {
    mockedSi.processes.mockResolvedValue({
      list: [{ pid: 1, name: 'init', cpu: 1.5, mem: 0.2 }],
    } as never)
    await expect(service.getProcesses()).resolves.toEqual([
      { pid: 1, name: 'init', cpu: 1.5, memory: 0.2 },
    ])
  })

  it('computes memory used and percentage', async () => {
    mockedSi.mem.mockResolvedValue({ total: 1000, available: 250 } as never)
    await expect(service.getMemoryInfo()).resolves.toEqual({
      total: 1000, used: 750, free: 250, usedPercent: 75,
    })
  })

  it('filters pseudo filesystems and derives disk usage', async () => {
    mockedSi.fsSize.mockResolvedValue([
      { fs: '/dev/sda1', type: 'ext4', size: 1000, available: 250, mount: '/' },
      { fs: 'tmpfs', type: 'tmpfs', size: 500, available: 500, mount: '/run' },
    ] as never)
    await expect(service.getDiskInfo()).resolves.toEqual([
      { mount: '/', total: 1000, used: 750, free: 250, usedPercent: 75 },
    ])
  })

  it('propagates errors from the underlying API', async () => {
    mockedSi.processes.mockRejectedValue(new Error('boom'))
    await expect(service.getProcesses()).rejects.toThrow('boom')
  })
})