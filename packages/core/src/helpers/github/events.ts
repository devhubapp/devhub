import _ from 'lodash'

import { EnhancedGitHubEvent } from '../..'

export function getOlderEventDate(events: EnhancedGitHubEvent[]) {
  const olderItem = _.orderBy(events, 'created_at', 'asc')[0]
  return olderItem && olderItem.created_at
}
