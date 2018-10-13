import { IGitHubRequestSubType, IGitHubRequestType } from '.'

export type Column =
  | {
      repoIsKnown?: boolean
      showAvatarAsIcon?: boolean
      subtype: IGitHubRequestSubType
      type: IGitHubRequestType
      username: string
    }
  | {
      repoIsKnown?: undefined
      showAvatarAsIcon?: undefined
      subtype?: undefined
      type: 'notifications'
      username?: undefined
    }
