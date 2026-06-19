import type { OsInfo, ProcessInfo, MemoryInfo, DiskInfo } from '../shared/types'

export const systemApi = {
  getOsInfo: (): Promise<OsInfo> => window.api.getOsInfo(),
  getProcesses: (): Promise<ProcessInfo[]> => window.api.getProcesses(),
  getMemoryInfo: (): Promise<MemoryInfo> => window.api.getMemoryInfo(),
  getDiskInfo: (): Promise<DiskInfo[]> => window.api.getDiskInfo(),
}