import _ from 'lodash'

import { GitHubItemSubjectType } from '../../types/github'
import { eventSubjectTypes } from './events'
import { issueOrPullRequestSubjectTypes } from './issues'
import { notificationSubjectTypes } from './notifications'

export const allSubjectTypes: GitHubItemSubjectType[] = _.uniq(
  _.sortBy(
    (eventSubjectTypes as GitHubItemSubjectType[])
      .concat(issueOrPullRequestSubjectTypes as GitHubItemSubjectType[])
      .concat(notificationSubjectTypes as GitHubItemSubjectType[]),
  ),
)
