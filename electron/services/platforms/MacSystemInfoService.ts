import { BaseSystemInfoService } from '../BaseSystemInfoService'

export class MacSystemInfoService extends BaseSystemInfoService {
  protected readonly platformName = 'macOS'

  protected shouldIncludeDisk(_type: string, mount: string): boolean {
    return mount === '/' || mount.startsWith('/Volumes/')
  }
}