import {
  fixURLForPlatform,
  GitHubURLOptions,
} from 'shared-core/dist/utils/helpers/github/url'
import { Platform } from '../../../libs/platform'

export function fixURL(url?: string, options?: GitHubURLOptions) {
  return fixURLForPlatform(url || '', Platform.realOS, options)
}
