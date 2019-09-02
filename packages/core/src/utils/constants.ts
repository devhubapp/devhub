import { ThemeName, ThemePair } from '../types'

const pkg = require('../../package.json') // tslint:disable-line

export const APP_VERSION = pkg.version as string

const _window = typeof window !== 'undefined' ? window : undefined
export const HOSTNAME =
  _window &&
  _window.location &&
  _window.location.hostname &&
  _window.location.hostname

export const IS_BETA =
  APP_VERSION.includes('beta') || (!!HOSTNAME && HOSTNAME.includes('beta'))

export const COLUMNS_LIMIT = 20
export const MIN_COLUMN_WIDTH = 300
export const MAX_COLUMN_WIDTH = 340

export const DISABLE_ANIMATIONS = false
export const DISABLE_SWIPEABLE_CARDS = false

export const DEFAULT_DARK_THEME: ThemeName = 'dark-gray'
export const DEFAULT_LIGHT_THEME: ThemeName = 'light-white'
export const DEFAULT_THEME_PAIR: ThemePair = {
  id: 'auto',
  color: '',
}

export const DEFAULT_GITHUB_OAUTH_SCOPES = ['notifications', 'user:email']

export const APPSTORE_ID = '1191864199'
export const GOOGLEPLAY_ID = 'com.devhubapp'

export const API_BASE_URL = 'https://api.devhubapp.com'
export const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`

export const DEVHUB_BETA_URL = 'https://beta.devhubapp.com'
export const SLACK_INVITE_LINK = 'https://slack.devhubapp.com'

export const APP_DEEP_LINK_SCHEMA = 'devhub'
export const APP_DEEP_LINK_URLS = {
  github_oauth: `${APP_DEEP_LINK_SCHEMA}://github/oauth`,
  preferences: `${APP_DEEP_LINK_SCHEMA}://preferences`,
  redux_action: `${APP_DEEP_LINK_SCHEMA}://action`,
}

// prettier-ignore
export const EMPTY_ARRAY = Object.freeze([]) as []

// prettier-ignore
export const EMPTY_OBJ = Object.freeze({}) as {}
