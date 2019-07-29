export type DesktopOS = 'macos' | 'windows' | 'linux'
export type MobileOS = 'ios' | 'android'
export type OS = DesktopOS | MobileOS

export type DownloadOption =
  | {
      category: 'web'
      platform: 'web'
      os: OS
    }
  | {
      category: 'mobile'
      platform: 'ios'
      os: MobileOS
    }
  | {
      category: 'mobile'
      platform: 'android'
      os: MobileOS
    }
  | {
      category: 'desktop'
      platform: 'web'
      os: DesktopOS
    }
  | {
      category: 'desktop'
      platform: 'web'
      os: DesktopOS
    }
  | {
      category: 'desktop'
      platform: 'web'
      os: DesktopOS
    }

export type PlatformCategory = DownloadOption['category']
export type Platform = DownloadOption['platform']

export interface PlanFeature {
  label: string
  available: boolean
}

export interface Plan {
  name: string
  description: string
  price: number
  period: 'month' | 'year'
  features: PlanFeature[]
}
