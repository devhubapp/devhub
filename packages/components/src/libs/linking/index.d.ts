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
  getInitialURL(): Promise<string>
  openURL(url: string): void
}

export const Linking: LinkingCrossPlatform
