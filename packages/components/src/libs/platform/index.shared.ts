export type PlatformName = 'android' | 'ios' | 'web'
export type PlatformRealOS = 'android' | 'ios' | 'macos' | 'windows' | 'linux'

export type PlataformSelectSpecifics<T> = {
  [platform in PlatformName | 'default']?: T
}

export type PlataformSelectSpecificsEnhanced<T> = {
  [platform in PlatformRealOS | 'web' | 'default']?: T
}

export interface PlatformSelectOptions {
  fallbackToWeb?: boolean
}
