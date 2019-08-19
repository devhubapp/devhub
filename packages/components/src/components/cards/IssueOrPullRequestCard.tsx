import React, { useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'

import {
  EnhancedGitHubIssueOrPullRequest,
  GitHubIssueOrPullRequestSubjectType,
} from '@devhub/core'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { tryFocus } from '../../utils/helpers/shared'
import { BaseCard } from './BaseCard'
import { BaseCardProps, getCardPropsForItem } from './BaseCard.shared'
import { CardBorder } from './partials/CardBorder'

export interface IssueOrPullRequestCardProps {
  cachedCardProps?: BaseCardProps | undefined
  isFocused?: boolean
  isPrivate?: boolean
  issueOrPullRequest: EnhancedGitHubIssueOrPullRequest
  ownerIsKnown: boolean
  repoIsKnown: boolean
  swipeable: boolean
  type: GitHubIssueOrPullRequestSubjectType
}

export const IssueOrPullRequestCard = React.memo(
  (props: IssueOrPullRequestCardProps) => {
    const {
      cachedCardProps,
      isFocused,
      issueOrPullRequest,
      ownerIsKnown,
      repoIsKnown,
    } = props

    const ref = useRef<View>(null)

    useEffect(() => {
      if (!(Platform.OS === 'web' && ref.current)) return
      if (isFocused) tryFocus(ref.current)
    }, [isFocused])

    const CardComponent = useMemo(
      () => (
        <BaseCard
          key={`issue_or_pr-base-card-${issueOrPullRequest.id}`}
          {...cachedCardProps ||
            getCardPropsForItem('issue_or_pr', issueOrPullRequest, {
              ownerIsKnown,
              repoIsKnown,
            })}
        />
      ),
      [cachedCardProps, issueOrPullRequest, ownerIsKnown, repoIsKnown],
    )

    return (
      <View ref={ref} style={sharedStyles.relative}>
        {CardComponent}
        {!!(!Platform.supportsTouch && isFocused) && <CardBorder />}
      </View>
    )
  },
)

IssueOrPullRequestCard.displayName = 'IssueOrPullRequestCard'
