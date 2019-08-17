import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'

import {
  EnhancedGitHubEvent,
  getEventIconAndColor,
  getEventMetadata,
  getGitHubEventSubItems,
  getOwnerAndRepo,
} from '@devhub/core'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
  mutedOpacity,
} from '../../styles/variables'
import { tryFocus } from '../../utils/helpers/shared'
import { getCardBackgroundThemeColor } from '../columns/ColumnRenderer'
import { Spacer } from '../common/Spacer'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedView } from '../themed/ThemedView'
import { CardActions } from './partials/CardActions'
import { CardBookmarkIndicator } from './partials/CardBookmarkIndicator'
import { CardBorder } from './partials/CardBorder'
import { EventCardHeader } from './partials/EventCardHeader'
import { BranchRow } from './partials/rows/BranchRow'
import { CommentRow } from './partials/rows/CommentRow'
import { CommitListRow } from './partials/rows/CommitListRow'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { ActionText } from './partials/rows/partials/ActionText'
import { ReleaseRow } from './partials/rows/ReleaseRow'
import { RepositoryListRow } from './partials/rows/RepositoryListRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'
import { innerCardSpacing, topCardMargin } from './partials/rows/styles'
import { UserListRow } from './partials/rows/UserListRow'
import { WikiPageListRow } from './partials/rows/WikiPageListRow'
import { cardStyles, spacingBetweenLeftAndRightColumn } from './styles'

export interface EventCardProps {
  event: EnhancedGitHubEvent
  isFocused?: boolean
  repoIsKnown: boolean
  swipeable: boolean
}

export const EventCard = React.memo((props: EventCardProps) => {
  const { event, isFocused, repoIsKnown, swipeable } = props

  const itemRef = useRef<View>(null)

  useEffect(() => {
    if (Platform.OS === 'web' && isFocused && itemRef.current) {
      tryFocus(itemRef.current)
    }
  }, [isFocused])

  if (!event) return null

  const {
    actor,
    avatarUrl,
    branchName,
    branchOrTagRef,
    comment,
    commitShas,
    commits,
    createdAt,
    forkRepoFullName,
    forkee,
    id,
    isBot,
    isBranchMainEvent,
    isForcePush,
    isPrivate,
    isPush,
    isRead,
    isSaved,
    isTagMainEvent,
    issueOrPullRequest,
    issueOrPullRequestNumber,
    mergedIds,
    pageShas,
    pages,
    release,
    repoFullName,
    repoIds: _repoIds,
    repos: _repos,
    userIds,
    users,
  } = getGitHubEventSubItems(event)

  const actionTextOptions: Parameters<typeof getEventMetadata>[1] = {
    appendColon: false,
    includeBranch: event.type === 'PushEvent',
    includeFork: false,
    includeTag: false,
    repoIsKnown,
  }

  const { actionText } = getEventMetadata(event, actionTextOptions)

  const actionTextWithoutColon = getEventMetadata(event, {
    ...actionTextOptions,
    appendColon: false,
  }).actionText

  const cardIconDetails = getEventIconAndColor(event)
  const cardIconName = cardIconDetails.subIcon || cardIconDetails.icon
  const cardIconColor = cardIconDetails.color

  const muted = false // isRead

  const repos = repoIsKnown ? _repos.slice(1) : _repos
  const repoIds = repoIsKnown ? _repoIds.slice(1) : _repoIds

  const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
    repoFullName || '',
  )
  const { owner: forkRepoOwnerName, repo: forkRepoName } = getOwnerAndRepo(
    forkRepoFullName || '',
  )

  const showCardBorder = !Platform.supportsTouch && isFocused

  const showCardActions = !swipeable

  let withTopMargin = true
  let withTopMarginCount = withTopMargin ? 1 : 0
  function getWithTopMargin() {
    const _withTopMargin = withTopMargin
    withTopMargin = true
    withTopMarginCount = withTopMarginCount + 1
    return _withTopMargin
  }

  const ActionTextComponent = (
    <ActionText
      body={actionText}
      branch={actionTextOptions!.includeBranch ? branchName : undefined}
      forkOwnerName={
        actionTextOptions!.includeFork ? forkRepoOwnerName : undefined
      }
      forkRepositoryName={
        actionTextOptions!.includeFork ? forkRepoName : undefined
      }
      muted={muted}
      numberOfLines={1}
      ownerName={repoOwnerName || ''}
      repositoryName={repoName || ''}
      tag={actionTextOptions!.includeTag ? branchOrTagRef : undefined}
    />
  )

  function renderContent() {
    return (
      <>
        {Boolean(comment && comment.body) && (
          <>
            <Spacer height={innerCardSpacing} />

            <CommentRow
              key={`event-comment-row-${comment.id}`}
              avatarUrl={comment.user.avatar_url}
              body={comment.body}
              leftContent="none"
              maxLength={100}
              muted={muted}
              url={comment.html_url || comment.url}
              userLinkURL={comment.user.html_url || ''}
              username={comment.user.display_login || comment.user.login}
              withTopMargin={getWithTopMargin() && false}
            />
          </>
        )}

        {repos.length > 0 && (
          <RepositoryListRow
            key={`event-repo-list-row-${repoIds.join('-')}`}
            data={repos}
            isForcePush={isForcePush}
            isPush={isPush}
            muted={muted}
            overlayThemeColor={theme =>
              getCardBackgroundThemeColor(theme, { muted: isRead })
            }
            small
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!branchName &&
          !(isBranchMainEvent && actionTextOptions!.includeBranch) && (
            <BranchRow
              key={`event-branch-row-${branchName}`}
              branch={branchName}
              isBranchMainEvent={isBranchMainEvent}
              muted={muted}
              ownerName={repoOwnerName || ''}
              repositoryName={repoName || ''}
              withTopMargin={getWithTopMargin()}
            />
          )}

        {!!(
          forkee &&
          forkRepoOwnerName &&
          forkRepoName &&
          !actionTextOptions!.includeFork
        ) && (
          <RepositoryRow
            key={`event-fork-row-${forkee.id}`}
            isForcePush={isForcePush}
            isFork
            muted={muted}
            ownerName={forkRepoOwnerName || ''}
            repositoryName={forkRepoName || ''}
            small
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!issueOrPullRequest && (
          <IssueOrPullRequestRow
            key={`event-issue-or-pr-row-${issueOrPullRequest.id}`}
            addBottomAnchor={!comment}
            avatarUrl={issueOrPullRequest.user.avatar_url}
            backgroundThemeColor={theme =>
              getCardBackgroundThemeColor(theme, { muted: isRead })
            }
            body={issueOrPullRequest.body}
            bold={!isRead}
            commentsCount={
              showCardActions ? undefined : issueOrPullRequest.comments
            }
            createdAt={issueOrPullRequest.created_at}
            hideIcon
            hideLabelText={false}
            // iconColor={issueIconColor || pullRequestIconColor}
            // iconName={issueIconName! || pullRequestIconName}
            id={issueOrPullRequest.id}
            isPrivate={isPrivate}
            muted={muted}
            issueOrPullRequestNumber={issueOrPullRequestNumber!}
            labels={issueOrPullRequest.labels}
            owner={repoOwnerName || ''}
            repo={repoName || ''}
            showBodyRow={
              false
              // !comment &&
              // !!(
              //   issueOrPullRequest &&
              //   issueOrPullRequest.state === 'open' &&
              //   issueOrPullRequest.body &&
              //   !(
              //     issueOrPullRequest.created_at &&
              //     issueOrPullRequest.updated_at &&
              //     new Date(issueOrPullRequest.updated_at).valueOf() -
              //       new Date(issueOrPullRequest.created_at).valueOf() >=
              //       1000 * 60 * 60 * 24
              //   )
              // )
              //   ? true
              //   : false
            }
            showCreationDetails={false}
            title={issueOrPullRequest.title}
            url={issueOrPullRequest.url}
            userLinkURL={issueOrPullRequest.user.html_url || ''}
            username={issueOrPullRequest.user.login || ''}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {users.length > 0 && (
          <UserListRow
            bold={false}
            data={users}
            key={`event-user-list-row-${userIds.join('-')}`}
            muted={muted}
            overlayThemeColor={theme =>
              getCardBackgroundThemeColor(theme, { muted: isRead })
            }
            withTopMargin={getWithTopMargin()}
          />
        )}

        {pages.length > 0 && (
          <WikiPageListRow
            bold={false}
            data={pages}
            key={`event-wiki-page-list-row-${pageShas.join('-')}`}
            muted={muted}
            overlayThemeColor={theme =>
              getCardBackgroundThemeColor(theme, { muted: isRead })
            }
            withTopMargin={getWithTopMargin()}
          />
        )}

        {commits.length > 0 && (
          <CommitListRow
            key={`event-commit-list-row-${commitShas.join('-')}`}
            bold={false}
            data={commits}
            isPrivate={isPrivate}
            muted={muted}
            overlayThemeColor={theme =>
              getCardBackgroundThemeColor(theme, { muted: isRead })
            }
            withTopMargin={getWithTopMargin()}
          />
        )}

        {Boolean(release) &&
          !(isTagMainEvent && actionTextOptions!.includeTag) && (
            <ReleaseRow
              key={`event-release-row-${release.id}`}
              avatarUrl={release.author.avatar_url}
              body={release.body}
              bold={!isRead}
              branch={release.target_commitish}
              hideIcon
              isPrivate={isPrivate}
              muted={muted}
              name={release.name}
              ownerName={repoOwnerName || ''}
              repositoryName={repoName || ''}
              tagName={release.tag_name}
              url={release.html_url || release.url}
              userLinkURL={release.author.html_url || ''}
              username={release.author.display_login || release.author.login}
              withTopMargin={getWithTopMargin()}
            />
          )}
      </>
    )
  }

  const Content = renderContent()

  return (
    <ThemedView
      key={`event-card-${id}-inner`}
      ref={itemRef}
      backgroundColor={theme =>
        getCardBackgroundThemeColor(theme, { muted: isRead })
      }
      style={cardStyles.container}
    >
      {!!isSaved && <CardBookmarkIndicator />}
      {!!showCardBorder && <CardBorder />}

      <View style={sharedStyles.flex}>
        <View style={[{ width: '100%' }, sharedStyles.horizontal]}>
          <Spacer width={contentPadding / 3} />

          <View style={[cardStyles.itemFixedWidth, cardStyles.itemFixedHeight]}>
            <ThemedIcon
              color={cardIconColor || 'foregroundColor'}
              name={cardIconName}
              selectable={false}
              style={[
                sharedStyles.textCenter,
                {
                  fontSize: columnHeaderItemContentSize,
                  opacity: muted ? mutedOpacity : 1,
                },
              ]}
              {...!!actionTextWithoutColon &&
                Platform.select({
                  web: { title: actionTextWithoutColon },
                })}
            />
          </View>

          <Spacer width={spacingBetweenLeftAndRightColumn} />

          <View style={sharedStyles.flex}>
            <EventCardHeader
              key={`event-card-header-${id}`}
              ActionTextComponent={ActionTextComponent}
              avatarUrl={avatarUrl}
              bold={!isRead}
              date={createdAt}
              ids={mergedIds || [id]}
              isBot={isBot}
              isPrivate={isPrivate}
              muted={muted}
              smallLeftColumn
              userLinkURL={actor.html_url || ''}
              username={actor.display_login || actor.login}
            />
          </View>
        </View>

        <View style={[{ width: '100%' }, sharedStyles.horizontal]}>
          <Spacer width={contentPadding / 3} />

          <View style={cardStyles.itemFixedWidth} />

          <Spacer width={spacingBetweenLeftAndRightColumn} />
          <View style={sharedStyles.flex}>{Content}</View>

          <Spacer width={spacingBetweenLeftAndRightColumn} />
          <View style={cardStyles.itemFixedWidth} />
        </View>

        {!!showCardActions && (
          <>
            <Spacer height={topCardMargin} />

            <CardActions
              commentsCount={
                issueOrPullRequest ? issueOrPullRequest.comments : undefined
              }
              commentsLink={
                (comment && (comment.html_url || comment.url)) ||
                (issueOrPullRequest &&
                  (issueOrPullRequest.html_url || issueOrPullRequest.url)) ||
                undefined
              }
              isRead={isRead}
              isSaved={isSaved}
              itemIds={[id]}
              muted={muted}
              type="activity"
            />
          </>
        )}

        <Spacer width={contentPadding / 3} />
      </View>
    </ThemedView>
  )
})

EventCard.displayName = 'EventCard'
