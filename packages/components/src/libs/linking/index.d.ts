export interface LinkingCrossPlatform {
  addEventListener: (
    event: 'url',
    handler: (payload: { url: string }) => void,
  ) => void
  removeEventListener: (
    event: 'url',
    handler: (payload: { url: string }) => void,
  ) => void
  canOpenURL(url: string): Promise<boolean>
  getCurrentURL(): string
  getInitialURL(): string
  openURL(url: string): Promise<void>
}

export const Linking: LinkingCrossPlatform
