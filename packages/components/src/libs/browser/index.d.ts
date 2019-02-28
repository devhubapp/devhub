export interface BrowserCrossPlatform {
  addEventListener: {
    (event: 'url', handler: (payload: { url: string }) => void): void
    (event: 'onDismiss', handler: () => void): void
  }
  removeEventListener: {
    (event: 'url', handler: (payload: { url: string }) => void): void
    (event: 'onDismiss', handler: () => void): void
  }
  dismiss(): void
  openURL(url: string): void
}

export const Browser: BrowserCrossPlatform
