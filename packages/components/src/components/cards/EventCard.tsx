import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'

import {
  CardViewMode,
  EnhancedGitHubEvent,
  getDateSmallText,
  getEventIconAndColor,
  getEventMetadata,
  getFullDateText,
  getGitHubEventSubItems,
  getOwnerAndRepo,
} from '@devhub/core'
import { useRepoTableColumnWidth } from '../../hooks/use-repo-table-column-width'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
  mutedOpacity,
  smallAvatarSize,
  smallerTextSize,
} from '../../styles/variables'
import { tryFocus } from '../../utils/helpers/shared'
import { getCardBackgroundThemeColor } from '../columns/ColumnRenderer'
import { Avatar } from '../common/Avatar'
import { BookmarkButton } from '../common/BookmarkButton'
import { IntervalRefresh } from '../common/IntervalRefresh'
import { Spacer } from '../common/Spacer'
import { ToggleReadButton } from '../common/ToggleReadButton'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { CardActions } from './partials/CardActions'
import { CardBookmarkIndicator } from './partials/CardBookmarkIndicator'
import { CardBorder } from './partials/CardBorder'
import { EventCardHeader } from './partials/EventCardHeader'
import { ActorActionRow } from './partials/rows/ActorActionRow'
import { BranchRow } from './partials/rows/BranchRow'
import { CommentRow } from './partials/rows/CommentRow'
import { CommitListRow } from './partials/rows/CommitListRow'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { LabelsView } from './partials/rows/LabelsView'
import { ReleaseRow } from './partials/rows/ReleaseRow'
import { RepositoryListRow } from './partials/rows/RepositoryListRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'
import { innerCardSpacing, topCardMargin } from './partials/rows/styles'
import { UserListRow } from './partials/rows/UserListRow'
import { WikiPageListRow } from './partials/rows/WikiPageListRow'
import { cardStyles, spacingBetweenLeftAndRightColumn } from './styles'

export interface EventCardProps {
  cardViewMode: CardViewMode
  enableCompactLabels?: boolean
  event: EnhancedGitHubEvent
  isFocused?: boolean
  repoIsKnown: boolean
  swipeable: boolean
}

export const EventCard = React.memo((props: EventCardProps) => {
  const {
    cardViewMode,
    enableCompactLabels,
    event,
    isFocused,
    repoIsKnown,
    swipeable,
  } = props

  const itemRef = useRef<View>(null)

  const repoTableColumnWidth = useRepoTableColumnWidth()

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
    includeBranch: cardViewMode === 'compact',
    includeFork: cardViewMode === 'compact',
    includeTag: cardViewMode === 'compact',
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

  const showCardBorder = Platform.realOS === 'web' && isFocused

  const showCardActions = cardViewMode !== 'compact' && !swipeable

  let withTopMargin = cardViewMode !== 'compact'
  let withTopMarginCount = withTopMargin ? 1 : 0
  function getWithTopMargin() {
    const _withTopMargin = withTopMargin
    withTopMargin = true
    withTopMarginCount = withTopMarginCount + 1
    return _withTopMargin
  }

  function renderContent() {
    return (
      <>
        {!!actionText && cardViewMode === 'compact' && (
          <ActorActionRow
            avatarUrl={avatarUrl}
            body={actionText}
            bold={!isRead}
            branch={isBranchMainEvent ? branchName : undefined}
            forkOwnerName={forkRepoOwnerName}
            forkRepositoryName={forkRepoName}
            isBot={isBot}
            muted={muted}
            ownerName={repoOwnerName || ''}
            repositoryName={repoName || ''}
            tag={isTagMainEvent ? branchOrTagRef : undefined}
            userLinkURL={actor.html_url || ''}
            username={actor.display_login || actor.login}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

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
              viewMode={cardViewMode}
              withTopMargin={getWithTopMargin() && false}
            />
          </>
        )}

        {repos.length > 0 &&
          (cardViewMode !== 'compact' || repos.length > 1) && (
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
              viewMode={cardViewMode}
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
              viewMode={cardViewMode}
              withTopMargin={getWithTopMargin()}
            />
          )}

        {!!(
          forkee &&
          forkRepoOwnerName &&
          forkRepoName &&
          cardViewMode !== 'compact' &&
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
            viewMode={cardViewMode}
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
            labels={enableCompactLabels ? [] : issueOrPullRequest.labels}
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
            viewMode={cardViewMode}
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
            viewMode={cardViewMode}
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
            viewMode={cardViewMode}
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
            viewMode={cardViewMode}
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
              viewMode={cardViewMode}
              withTopMargin={getWithTopMargin()}
            />
          )}
      </>
    )
  }

  const Content = renderContent()

  const isSingleRow = withTopMarginCount <= 1 && !release
  const alignVertically = isSingleRow

  if (cardViewMode === 'compact') {
    return (
      <ThemedView
        key={`event-card-${id}-compact-inner`}
        ref={itemRef}
        backgroundColor={theme =>
          getCardBackgroundThemeColor(theme, { muted: isRead })
        }
        style={[
          cardStyles.compactContainer,
          alignVertically && { alignItems: 'center' },
        ]}
      >
        {!!showCardBorder && <CardBorder />}

        {/* <CenterGuide /> */}

        {/* <View
          style={[cardStyles.compactItemFixedWidth, cardStyles.compactItemFixedHeight]}
        >
          <Checkbox analyticsLabel={undefined} size={columnHeaderItemContentSize} />
        </View>

        <Spacer width={contentPadding} /> */}

        <View style={cardStyles.compactItemFixedHeight}>
          <BookmarkButton
            isSaved={isSaved}
            itemIds={id}
            size={columnHeaderItemContentSize}
          />
        </View>

        <Spacer
          width={
            spacingBetweenLeftAndRightColumn - columnHeaderItemContentSize / 4
          }
        />

        {!repoIsKnown && (
          <>
            <View
              style={[
                cardStyles.compactItemFixedWidth,
                cardStyles.compactItemFixedHeight,
              ]}
            >
              <Avatar
                isBot={isBot}
                linkURL=""
                muted={muted}
                small
                size={smallAvatarSize}
                username={repoOwnerName}
              />
            </View>

            <Spacer width={spacingBetweenLeftAndRightColumn} />

            <View
              style={[
                cardStyles.compactItemFixedMinHeight,
                {
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  width: repoTableColumnWidth,
                  overflow: 'hidden',
                },
              ]}
            >
              {!!(repoOwnerName && repoName) && (
                <RepositoryRow
                  key={`notification-repo-row-${repoOwnerName}-${repoName}`}
                  disableLeft
                  hideOwner
                  muted={muted}
                  ownerName={repoOwnerName}
                  repositoryName={repoName}
                  rightContainerStyle={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    width: repoTableColumnWidth,
                  }}
                  small
                  viewMode={cardViewMode}
                  withTopMargin={false}
                />
              )}
            </View>

            <Spacer width={spacingBetweenLeftAndRightColumn} />
          </>
        )}

        <View
          style={[
            sharedStyles.flex,
            sharedStyles.horizontal,
            { alignItems: 'flex-start' },
          ]}
        >
          <View
            style={[
              cardStyles.compactItemFixedWidth,
              cardStyles.compactItemFixedHeight,
            ]}
          >
            <ThemedIcon
              color={cardIconColor || 'foregroundColor'}
              name={cardIconName}
              selectable={false}
              style={{
                fontSize: columnHeaderItemContentSize,
                textAlign: 'center',
                opacity: muted ? mutedOpacity : 1,
              }}
              {...!!actionTextWithoutColon &&
                Platform.select({
                  web: { title: actionTextWithoutColon },
                })}
            />
          </View>

          <Spacer width={spacingBetweenLeftAndRightColumn} />

          <View style={[sharedStyles.flex, sharedStyles.horizontal]}>
            <View style={sharedStyles.flex}>{Content}</View>

            <Spacer width={contentPadding / 3} />
          </View>
        </View>

        <Spacer width={spacingBetweenLeftAndRightColumn} />

        {!!enableCompactLabels &&
          !!issueOrPullRequest &&
          !!issueOrPullRequest.labels &&
          issueOrPullRequest.labels.length > 0 && (
            <>
              <LabelsView
                backgroundThemeColor={theme =>
                  getCardBackgroundThemeColor(theme, { muted: isRead })
                }
                enableScrollView={isSingleRow}
                labels={issueOrPullRequest.labels.map(label => ({
                  key: `issue-or-pr-row-${
                    issueOrPullRequest.id
                  }-${issueOrPullRequestNumber}-label-${label.id ||
                    label.name}`,
                  color: label.color && `#${label.color}`,
                  name: label.name,
                }))}
                muted={muted}
                style={{
                  alignSelf: 'center',
                  justifyContent: 'flex-end',
                  maxWidth:
                    260 +
                    (repoIsKnown ? repoTableColumnWidth + 20 : 0) +
                    (`${issueOrPullRequest.title || ''}`.length <= 50
                      ? 100
                      : 0),
                  overflow: 'hidden',
                }}
                textThemeColor={
                  muted ? 'foregroundColorMuted40' : 'foregroundColorMuted60'
                }
              />

              <Spacer width={spacingBetweenLeftAndRightColumn} />
            </>
          )}

        <View
          style={[
            cardStyles.compactItemFixedMinHeight,
            {
              alignSelf: 'center',
              alignItems: 'flex-end',
              width: 60,
            },
          ]}
        >
          {!!createdAt && (
            <IntervalRefresh date={createdAt}>
              {() => {
                const dateText = getDateSmallText(createdAt, false)
                if (!dateText) return null

                return (
                  <ThemedText
                    color={
                      muted
                        ? 'foregroundColorMuted40'
                        : 'foregroundColorMuted60'
                    }
                    numberOfLines={1}
                    style={[
                      cardStyles.timestampText,
                      cardStyles.smallText,
                      { fontSize: smallerTextSize },
                    ]}
                    {...Platform.select({
                      web: { title: getFullDateText(createdAt) },
                    })}
                  >
                    {!!isPrivate && (
                      <>
                        <ThemedIcon
                          name="lock"
                          style={cardStyles.smallerText}
                        />{' '}
                      </>
                    )}
                    {dateText}
                  </ThemedText>
                )
              }}
            </IntervalRefresh>
          )}
        </View>

        <Spacer width={contentPadding / 2} />

        <View
          style={[
            cardStyles.compactItemFixedHeight,
            {
              alignSelf: 'center',
            },
          ]}
        >
          <ToggleReadButton
            isRead={isRead}
            itemIds={id}
            muted={muted}
            size={columnHeaderItemContentSize}
            type="activity"
          />
        </View>
      </ThemedView>
    )
  }

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
              style={{
                fontSize: columnHeaderItemContentSize,
                textAlign: 'center',
                opacity: muted ? mutedOpacity : 1,
              }}
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
              actionText={actionText}
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
