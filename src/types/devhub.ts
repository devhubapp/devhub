import { IGitHubRequestSubType, IGitHubRequestType } from '.'

export type Column =
  | {
      repoIsKnown?: undefined
      subtype?: undefined
      type: 'notifications'
      username?: undefined
    }
  | {
      repoIsKnown?: boolean
      subtype: IGitHubRequestSubType
      type: IGitHubRequestType
      username: string
    }
