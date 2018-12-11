export interface Analytics {
  setUser(userId: string): void
  trackEvent(category: string, action: string): void
  trackException(description: string, isFatal?: boolean): void
  trackModalView(modalName: string): void
  trackScreenView(screenName: string): void
}

export const analytics: Analytics
