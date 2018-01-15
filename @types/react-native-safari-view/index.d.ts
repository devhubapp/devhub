declare module 'react-native-safari-view' {
  import { EmitterSubscription } from 'react-native'

  export type Event = 'onShow' | 'onDismiss'
  export interface ISafaryOptions {
    url: string
    readerMode?: boolean
    tintColor?: string
    barTintColor?: string
    fromBottom?: boolean
  }

  export function show(options: ISafaryOptions): void
  export function dismiss(): void
  export function isAvailable(): boolean
  export function addEventListener(
    event: Event,
    listener: () => any,
  ): EmitterSubscription
  export function removeEventListener(event: Event, listener: () => any): void
}
