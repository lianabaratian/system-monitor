import type { SystemInfoService } from './SystemInfoService'
import { MacSystemInfoService } from './platforms/MacSystemInfoService'
import { LinuxSystemInfoService } from './platforms/LinuxSystemInfoService'
import { WindowsSystemInfoService } from './platforms/WindowsSystemInfoService'

export function createSystemInfoService(
  platform: NodeJS.Platform = process.platform,
): SystemInfoService {
  switch (platform) {
    case 'darwin':
      return new MacSystemInfoService()
    case 'linux':
      return new LinuxSystemInfoService()
    case 'win32':
      return new WindowsSystemInfoService()
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}