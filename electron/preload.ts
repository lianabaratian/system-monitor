import { ipcRenderer, contextBridge } from 'electron'
import { IPC_CHANNELS } from '../src/shared/types'
import type { SystemApi } from '../src/shared/types'

// --------- Expose the generic ipcRenderer bridge (from template) ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

const systemApi: SystemApi = {
  getOsInfo: () => ipcRenderer.invoke(IPC_CHANNELS.GET_OS_INFO),
  getProcesses: () => ipcRenderer.invoke(IPC_CHANNELS.GET_PROCESSES),
  getMemoryInfo: () => ipcRenderer.invoke(IPC_CHANNELS.GET_MEMORY_INFO),
  getDiskInfo: () => ipcRenderer.invoke(IPC_CHANNELS.GET_DISK_INFO),
}

contextBridge.exposeInMainWorld('api', systemApi)