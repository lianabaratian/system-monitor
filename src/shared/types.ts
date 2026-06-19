export interface OsInfo {
  platform: string       
  distro: string       
  release: string   
  arch: string        
  hostname: string
  username: string | null 
}

export interface ProcessInfo {
  pid: number
  name: string
  cpu: number    
  memory: number 
}

export interface MemoryInfo {
  total: number      
  used: number     
  free: number       
  usedPercent: number 
}

export interface DiskInfo {
  mount: string
  total: number       
  used: number        
  free: number        
  usedPercent: number 
}

export const IPC_CHANNELS = {
  GET_OS_INFO: 'system:get-os-info',
  GET_PROCESSES: 'system:get-processes',
  GET_MEMORY_INFO: 'system:get-memory-info',
  GET_DISK_INFO: 'system:get-disk-info',
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]

export interface SystemApi {
  getOsInfo(): Promise<OsInfo>
  getProcesses(): Promise<ProcessInfo[]>
  getMemoryInfo(): Promise<MemoryInfo>
  getDiskInfo(): Promise<DiskInfo[]>
}