import { describe, it, expect } from 'vitest'
import { createSystemInfoService } from './ServiceFactory'
import { MacSystemInfoService } from './platforms/MacSystemInfoService'
import { LinuxSystemInfoService } from './platforms/LinuxSystemInfoService'
import { WindowsSystemInfoService } from './platforms/WindowsSystemInfoService'

describe('createSystemInfoService', () => {
  it('returns the macOS service for darwin', () => {
    expect(createSystemInfoService('darwin')).toBeInstanceOf(MacSystemInfoService)
  })
  it('returns the Linux service for linux', () => {
    expect(createSystemInfoService('linux')).toBeInstanceOf(LinuxSystemInfoService)
  })
  it('returns the Windows service for win32', () => {
    expect(createSystemInfoService('win32')).toBeInstanceOf(WindowsSystemInfoService)
  })
  it('throws for an unsupported platform', () => {
    expect(() => createSystemInfoService('sunos' as NodeJS.Platform)).toThrow(/unsupported/i)
  })
})