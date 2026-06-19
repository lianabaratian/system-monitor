import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../src/shared/types'
import type { SystemInfoService } from '../services/SystemInfoService'

export function registerIpcHandlers(service: SystemInfoService): void {
  const handle = <T>(channel: string, fn: () => Promise<T>) =>
    ipcMain.handle(channel, async () => {
      try {
        return await fn()
      } catch (error) {
        console.error(`[ipc] ${channel} failed:`, error)
        throw error // re-throw so the renderer's invoke() rejects and the UI shows the error
      }
    })

  handle(IPC_CHANNELS.GET_OS_INFO, () => service.getOsInfo())
  handle(IPC_CHANNELS.GET_PROCESSES, () => service.getProcesses())
  handle(IPC_CHANNELS.GET_MEMORY_INFO, () => service.getMemoryInfo())
  handle(IPC_CHANNELS.GET_DISK_INFO, () => service.getDiskInfo())
}