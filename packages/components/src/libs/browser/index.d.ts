import { InAppBrowserOptions } from 'react-native-inappbrowser-reborn'

export interface BrowserCrossPlatform {
  addListener: {
    (event: 'url', handler: (payload: { url: string }) => void): {
      remove: () => void
    } | null
    (event: 'onDismiss', handler: () => void): {
      remove: () => void
    } | null
  }
  dismiss(): void
  openURL(
    url: string,
    options?: { native?: InAppBrowserOptions },
  ): Promise<void>
  openURLOnNewTab(url: string): void
  setBackgroundColor(color: string): void
  setForegroundColor(color: string): void
}

export const Browser: BrowserCrossPlatform
