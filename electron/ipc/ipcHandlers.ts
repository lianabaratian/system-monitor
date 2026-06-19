import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../src/shared/types'
import type { SystemInfoService } from '../services/SystemInfoService'

export function registerIpcHandlers(service: SystemInfoService): void {
  ipcMain.handle(IPC_CHANNELS.GET_OS_INFO, () => service.getOsInfo())
  ipcMain.handle(IPC_CHANNELS.GET_PROCESSES, () => service.getProcesses())
  ipcMain.handle(IPC_CHANNELS.GET_MEMORY_INFO, () => service.getMemoryInfo())
  ipcMain.handle(IPC_CHANNELS.GET_DISK_INFO, () => service.getDiskInfo())
}