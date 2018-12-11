export interface Analytics {
  setUser(userId: string): void
  trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: number,
    payload?: Record<string, string | number | undefined>,
  ): void
  trackModalView(modalName: string): void
  trackScreenView(screenName: string): void
}

export const analytics: Analytics
