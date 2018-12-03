import {
  fixURLForPlatform,
  GitHubURLOptions,
} from '@devhub/core/src/utils/helpers/github/url'
import { Platform } from '../../../libs/platform'

export function fixURL(url?: string, options?: GitHubURLOptions) {
  return fixURLForPlatform(url || '', Platform.realOS, options)
}
