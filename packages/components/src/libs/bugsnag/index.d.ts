import { ComponentClass } from 'react'

export interface BugnsagCrossPlatform {
  clearUser(): void
  leaveBreadcrumb(name: string, metadata?: any): void
  notify(error: Error, metadata?: any): void
  setUser(userId: string, name?: string, email?: string): void
}

export const bugsnag: BugnsagCrossPlatform
export const ErrorBoundary: ComponentClass
