import os from 'node:os'
import si from 'systeminformation'
import type { OsInfo, ProcessInfo, MemoryInfo, DiskInfo } from '../../src/shared/types'
import type { SystemInfoService } from './SystemInfoService'

export abstract class BaseSystemInfoService implements SystemInfoService {

  protected abstract readonly platformName: string

  async getOsInfo(): Promise<OsInfo> {
    const info = await si.osInfo()
    return {
      platform: process.platform,
      distro: info.distro || this.platformName,
      release: info.release,
      arch: info.arch || process.arch,
      hostname: info.hostname || os.hostname(),
      username: this.getUsername(),
    }
  }

  async getProcesses(): Promise<ProcessInfo[]> {
    const { list } = await si.processes()
    return list.map((p) => ({
      pid: p.pid,
      name: p.name,
      cpu: p.cpu ?? 0,  
      memory: p.mem ?? 0, 
    }))
  }

  async getMemoryInfo(): Promise<MemoryInfo> {
    const mem = await si.mem()

    const used = mem.total - mem.available
    return {
      total: mem.total,
      used,
      free: mem.available,
      usedPercent: mem.total > 0 ? (used / mem.total) * 100 : 0,
    }
  }

  async getDiskInfo(): Promise<DiskInfo[]> {
    const disks = await si.fsSize()
    return disks
      .filter((d) => this.shouldIncludeDisk(d.type, d.mount))
      .map((d) => ({
        mount: d.mount,
        total: d.size,
        used: d.used,
        free: d.size - d.used,
        usedPercent: d.use ?? 0, 
      }))
  }

  protected getUsername(): string | null {
    try {
      return os.userInfo().username
    } catch {
      return null
    }
  }

  protected shouldIncludeDisk(_type: string, _mount: string): boolean {
    return true
  }
}