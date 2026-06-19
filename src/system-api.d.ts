import type { SystemApi } from './types'

declare global {
  interface Window {
    api: SystemApi
  }
}