import _ from 'lodash'

import { DevHubAnalyticsCustomDimensions } from './'

export function formatDimensions(
  dimensions: Partial<DevHubAnalyticsCustomDimensions>,
) {
  return _.mapValues(dimensions, d => {
    if (typeof d === 'string') return d
    if (typeof d === 'boolean' || typeof d === 'number') return `${d}`
    if (d) return `${d}`
    return null
  }) as Record<keyof DevHubAnalyticsCustomDimensions, string | null>
}
