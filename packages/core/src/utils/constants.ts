import { ThemePair } from '../types'

export const COLUMNS_LIMIT = 20
export const MIN_COLUMN_WIDTH = 320
export const MAX_COLUMN_WIDTH = 360

export const DEFAULT_DARK_THEME = 'dark-purple'
export const DEFAULT_LIGHT_THEME = 'light-purple'
export const DEFAULT_THEME_PAIR: ThemePair = { id: 'auto', color: '' }

export const DEFAULT_GITHUB_OAUTH_SCOPES = ['notifications', 'user:email']
export const DEFAULT_PAGINATION_PER_PAGE = 10

export const API_BASE_URL = 'https://api.devhubapp.com'
export const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`

export const GITHUB_OAUTH_CLIENT_ID =
  process.env.NODE_ENV === 'development'
    ? 'b9e8939fe03b6d43f63c'
    : '081d51ecc94dea9a425a'

export const GITHUB_APP_CLIENT_ID =
  process.env.NODE_ENV === 'development'
    ? 'Iv1.3a9a22eb0411a34c'
    : 'Iv1.dd926dcdad794eb8'

export const GITHUB_APP_CANNONICAL_ID =
  process.env.NODE_ENV === 'development' ? 'devhub-localhost-app' : 'devhub-app'
