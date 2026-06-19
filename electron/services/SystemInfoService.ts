import type { OsInfo, ProcessInfo, MemoryInfo, DiskInfo } from '../../src/shared/types'

export interface SystemInfoService {
  getOsInfo(): Promise<OsInfo>
  getProcesses(): Promise<ProcessInfo[]>
  getMemoryInfo(): Promise<MemoryInfo>
  getDiskInfo(): Promise<DiskInfo[]>
}