import { ipcRenderer, contextBridge } from 'electron'
import { IPC_CHANNELS } from '../src/shared/types'
import type { SystemApi } from '../src/shared/types'

const systemApi: SystemApi = {
  getOsInfo: () => ipcRenderer.invoke(IPC_CHANNELS.GET_OS_INFO),
  getProcesses: () => ipcRenderer.invoke(IPC_CHANNELS.GET_PROCESSES),
  getMemoryInfo: () => ipcRenderer.invoke(IPC_CHANNELS.GET_MEMORY_INFO),
  getDiskInfo: () => ipcRenderer.invoke(IPC_CHANNELS.GET_DISK_INFO),
}

contextBridge.exposeInMainWorld('api', systemApi)