import { fixURLForPlatform, GitHubURLOptions } from '@devhub/core'
import { Platform } from '../../../libs/platform'

export function fixURL(url?: string, options?: GitHubURLOptions) {
  return fixURLForPlatform(
    url || '',
    Platform.realOS === 'ios' || Platform.realOS === 'android',
    options,
  )
}
