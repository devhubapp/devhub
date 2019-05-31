import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'

import {
  CardViewMode,
  EnhancedGitHubEvent,
  getBranchNameFromRef,
  getDateSmallText,
  getEventIconAndColor,
  getEventMetadata,
  getFullDateText,
  getGitHubAvatarURLFromPayload,
  getGitHubURLForRepo,
  getIssueOrPullRequestNumberFromUrl,
  getOwnerAndRepo,
  getRepoFullNameFromObject,
  getRepoFullNameFromUrl,
  GitHubCommitCommentEvent,
  GitHubCreateEvent,
  GitHubEvent,
  GitHubForkEvent,
  GitHubGollumEvent,
  GitHubIssuesEvent,
  GitHubMemberEvent,
  GitHubPage,
  GitHubPullRequestEvent,
  GitHubPushedCommit,
  GitHubPushEvent,
  GitHubReleaseEvent,
  GitHubRepo,
  GitHubUser,
  isBranchMainEvent,
  isEventPrivate,
  isItemRead,
  isTagMainEvent,
  MultipleStarEvent,
} from '@devhub/core'
import { useRepoTableColumnWidth } from '../../hooks/use-repo-table-column-width'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
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
import { CardFocusBorder } from './partials/CardFocusBorder'
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

  const { actor, payload, id, saved, type } = event as EnhancedGitHubEvent
  const { repo: _repo } = event as GitHubEvent
  const { repos: _repos } = event as MultipleStarEvent

  const { comment } = payload as GitHubCommitCommentEvent['payload']
  const { commits: _commits } = payload as GitHubPushEvent['payload']
  const { forkee } = payload as GitHubForkEvent['payload']
  const { member: _member } = payload as GitHubMemberEvent['payload']
  let { release } = payload as GitHubReleaseEvent['payload']
  const { pages: _pages } = payload as GitHubGollumEvent['payload']
  const {
    pull_request: pullRequest,
  } = payload as GitHubPullRequestEvent['payload']
  const { issue } = payload as GitHubIssuesEvent['payload']
  const { ref: branchOrTagRef } = payload as GitHubPushEvent['payload']

  let branchName = getBranchNameFromRef(branchOrTagRef)

  const issueOrPullRequest = (issue || pullRequest) as
    | typeof issue
    | typeof pullRequest
    | undefined

  const issueOrPullRequestNumber = issueOrPullRequest
    ? issueOrPullRequest.number ||
      getIssueOrPullRequestNumberFromUrl(issueOrPullRequest!.url)
    : undefined

  const isRead = isItemRead(event)
  const isSaved = saved === true
  const muted = isRead

  const commits: GitHubPushedCommit[] = (_commits || []).filter(Boolean)

  const _allRepos: GitHubRepo[] = (_repos || [_repo]).filter(r => {
    if (!(r && r.name)) return false

    const or = getOwnerAndRepo(r.name)
    return !!(or.owner && or.repo)
  })

  // ugly and super edge case workaround for repo not being returned on some commit events
  if (!_allRepos.length && commits[0]) {
    const _repoFullName = getRepoFullNameFromUrl(commits[0].url)
    const { owner, repo: name } = getOwnerAndRepo(_repoFullName)
    if (owner && name) {
      _allRepos.push({
        id: '',
        fork: false,
        private: false,
        full_name: _repoFullName,
        owner: { login: name } as any,
        name,
        url: getGitHubURLForRepo(owner, name)!,
        html_url: getGitHubURLForRepo(owner, name)!,
      })
    }
  }

  const repos: GitHubRepo[] = _allRepos.filter(
    (r, index) => !!(r && !(repoIsKnown && index === 0)),
  )
  const users: GitHubUser[] = [_member].filter(Boolean) // TODO
  const pages: GitHubPage[] = (_pages || []).filter(Boolean)

  const repo = _allRepos.length === 1 ? _allRepos[0] : undefined

  if (event.type === 'CreateEvent' || event.type === 'DeleteEvent') {
    const p = payload as GitHubCreateEvent['payload']

    if (p.ref_type !== 'branch') branchName = ''

    if (!release && p.ref_type === 'tag') {
      release = {
        id: '',
        name: '',
        tag_name: p.ref || '',
        target_commitish: p.master_branch,
        body: '',
        draft: false,
        prerelease: false,
        created_at: event.created_at,
        published_at: event.created_at,
        author: event.actor,
        assets: [],
        url: '',
        html_url: '',
      }
    }
  }

  const commitIds = commits
    .filter(Boolean)
    .map((item: GitHubPushedCommit) => item.sha)
  const pageIds = pages.filter(Boolean).map((item: GitHubPage) => item.sha)
  const repoIds = repos.filter(Boolean).map((item: GitHubRepo) => item.id)
  const userIds = users.filter(Boolean).map((item: GitHubUser) => item.id)

  const repoFullName = repo && getRepoFullNameFromObject(repo)
  const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
    repoFullName || '',
  )

  const forkRepoFullName = getRepoFullNameFromObject(forkee)
  const { owner: forkRepoOwnerName, repo: forkRepoName } = getOwnerAndRepo(
    forkRepoFullName,
  )

  const cardIconDetails = getEventIconAndColor(event)
  const cardIconName = cardIconDetails.subIcon || cardIconDetails.icon
  const cardIconColor = cardIconDetails.color

  const actionTextOptions: Parameters<typeof getEventMetadata>[1] = {
    appendColon: false,
    includeBranch: cardViewMode === 'compact',
    includeFork: cardViewMode === 'compact',
    includeTag: cardViewMode === 'compact',
    repoIsKnown: repoIsKnown || cardViewMode === 'compact',
  }
  const { actionText } = getEventMetadata(event, actionTextOptions)
  const actionTextWithoutColon = getEventMetadata(event, {
    ...actionTextOptions,
    appendColon: false,
  }).actionText

  const isPush = type === 'PushEvent'
  const isForcePush = isPush && (payload as GitHubPushEvent).forced
  const isPrivate = isEventPrivate(event)

  const isBot = Boolean(actor.login && actor.login.indexOf('[bot]') >= 0)

  // GitHub returns the wrong avatar_url for app bots on actor.avatar_url,
  // but the correct avatar on payload.abc.user.avatar_url,
  // so lets get it from there instead
  const botAvatarURL = isBot
    ? getGitHubAvatarURLFromPayload(payload, actor.id)
    : undefined

  const avatarUrl = (isBot && botAvatarURL) || actor.avatar_url

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
            branch={isBranchMainEvent(event) ? branchName : undefined}
            forkOwnerName={forkRepoOwnerName}
            forkRepositoryName={forkRepoName}
            isBot={isBot}
            muted={muted}
            ownerName={repoOwnerName || ''}
            repositoryName={repoName || ''}
            tag={isTagMainEvent(event) ? branchOrTagRef : undefined}
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
              isForcePush={isForcePush}
              isPush={isPush}
              muted={muted}
              repos={repos}
              small
              viewMode={cardViewMode}
              withTopMargin={getWithTopMargin()}
            />
          )}

        {!!branchName &&
          !(isBranchMainEvent(event) && actionTextOptions!.includeBranch) && (
            <BranchRow
              key={`event-branch-row-${branchName}`}
              branch={branchName}
              isBranchMainEvent={isBranchMainEvent(event)}
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
              getCardBackgroundThemeColor(theme, { muted })
            }
            body={issueOrPullRequest.body}
            bold
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
            muted={muted}
            key={`event-user-list-row-${userIds.join('-')}`}
            users={users}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {pages.length > 0 && (
          <WikiPageListRow
            bold={false}
            muted={muted}
            key={`event-wiki-page-list-row-${pageIds.join('-')}`}
            pages={pages}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {commits.length > 0 && (
          <CommitListRow
            key={`event-commit-list-row-${commitIds.join('-')}`}
            bold={false}
            commits={commits}
            isPrivate={isPrivate}
            muted={muted}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {Boolean(release) &&
          !(isTagMainEvent(event) && actionTextOptions!.includeTag) && (
            <ReleaseRow
              key={`event-release-row-${release.id}`}
              avatarUrl={release.author.avatar_url}
              body={release.body}
              bold
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
        backgroundColor={theme => getCardBackgroundThemeColor(theme, { muted })}
        style={[
          cardStyles.compactContainer,
          alignVertically && { alignItems: 'center' },
        ]}
      >
        {!!isFocused && <CardFocusBorder />}

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
            itemIds={[id]}
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
                  getCardBackgroundThemeColor(theme, { muted })
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
          {!!event.created_at && (
            <IntervalRefresh date={event.created_at}>
              {() => {
                const dateText = getDateSmallText(event.created_at, false)
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
                      web: { title: getFullDateText(event.created_at) },
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
            itemIds={[id]}
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
      backgroundColor={theme => getCardBackgroundThemeColor(theme, { muted })}
      style={cardStyles.container}
    >
      {!!isSaved && <CardBookmarkIndicator />}
      {!!isFocused && <CardFocusBorder />}

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
                // opacity: muted ? mutedOpacity : 1,
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
              date={event.created_at}
              ids={('merged' in event && event.merged) || [id]}
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
              type="activity"
            />
          </>
        )}

        <Spacer width={contentPadding / 3} />
      </View>
    </ThemedView>
  )
})
