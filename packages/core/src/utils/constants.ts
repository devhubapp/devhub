import { ThemePair } from '../types'

const pkg = require('../../package.json') // tslint:disable-line

export const appVersion = pkg.version as string
const isBeta = appVersion.includes('beta')

const _window = typeof window !== 'undefined' ? window : undefined
const _hostname =
  _window &&
  _window.location &&
  _window.location.hostname &&
  _window.location.hostname
const isLocal = _hostname === 'localhost'

export const COLUMNS_LIMIT = 20
export const MIN_COLUMN_WIDTH = 300
export const MAX_COLUMN_WIDTH = 340

export const DISABLE_ANIMATIONS = false
export const DISABLE_SWIPEABLE_CARDS = true
export const DISABLE_SINGLE_COLUMN = !isBeta && !isLocal

export const DEFAULT_DARK_THEME = 'dark-gray'
export const DEFAULT_LIGHT_THEME = 'light-blue'
export const DEFAULT_THEME_PAIR: ThemePair = {
  id: DEFAULT_DARK_THEME,
  color: '',
}

export const DEFAULT_GITHUB_OAUTH_SCOPES = ['notifications', 'user:email']

export const APPSTORE_ID = '1191864199'
export const GOOGLEPLAY_ID = 'com.devhubapp'

export const API_BASE_URL = 'https://api.devhubapp.com'
export const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`

export const SLACK_INVITE_LINK =
  'https://join.slack.com/t/devhubapp/shared_invite/enQtNjEyNzMzODg3MzYzLWY1NGUwZTVhM2FlMjY5ZmY5YzE1MThjNzM0NDIzNzQyYzJkMWEyYjRkNTg0MTIxNGJkYmM1ZTRmODE2MTVkY2Q'
