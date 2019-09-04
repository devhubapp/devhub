import React from 'react'

export interface BugnsagCrossPlatform {
  clearUser(): void
  leaveBreadcrumb(name: string, metadata?: any): void
  notify(error: Error, metadata?: any): void
  setUser(userId: string, name?: string, email?: string): void
}

export const bugsnag: BugnsagCrossPlatform

export interface ErrorBoundaryState {
  error?: Error
  info?: {
    componentStack?: string
  }
}

export interface ErrorBoundaryProps {
  FallbackComponent?: React.ComponentType<ErrorBoundaryState>
}
export const ErrorBoundary: React.ComponentClass<ErrorBoundaryProps>
