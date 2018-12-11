export interface Analytics {
  setUser(userId: string): void
  trackEvent(category: string, action: string): void
  trackModalView(modalName: string): void
  trackScreenView(screenName: string): void
}

export const analytics: Analytics
