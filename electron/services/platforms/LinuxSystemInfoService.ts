import { BaseSystemInfoService } from '../BaseSystemInfoService'

export class LinuxSystemInfoService extends BaseSystemInfoService {
  protected readonly platformName = 'Linux'

  protected shouldIncludeDisk(type: string): boolean {
    const pseudo = ['tmpfs', 'devtmpfs', 'squashfs', 'overlay', 'proc', 'sysfs']
    return !pseudo.includes(type)
  }
}