import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'

import {
  CardViewMode,
  EnhancedGitHubNotification,
  getDateSmallText,
  getFullDateText,
  getGitHubURLForRepo,
  getIssueOrPullRequestNumberFromUrl,
  getOwnerAndRepo,
  getUserAvatarByUsername,
  GitHubLabel,
  GitHubNotificationReason,
  isItemRead,
  isNotificationPrivate,
  Theme,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
  smallerTextSize,
} from '../../styles/variables'
import { getReadableColor } from '../../utils/helpers/colors'
import { getNotificationIconAndColor } from '../../utils/helpers/github/notifications'
import { tryFocus } from '../../utils/helpers/shared'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { getColumnCardThemeColors } from '../columns/ColumnRenderer'
import { Avatar } from '../common/Avatar'
import { BookmarkButton } from '../common/BookmarkButton'
import { IntervalRefresh } from '../common/IntervalRefresh'
import { Spacer } from '../common/Spacer'
import { ToggleReadButton } from '../common/ToggleReadButton'
import { useTheme } from '../context/ThemeContext'
import { CardFocusBorder } from './partials/CardFocusBorder'
import { NotificationCardHeader } from './partials/NotificationCardHeader'
import { CommentRow } from './partials/rows/CommentRow'
import { CommitRow } from './partials/rows/CommitRow'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { NotificationReason } from './partials/rows/partials/NotificationReason'
import { PrivateNotificationRow } from './partials/rows/PrivateNotificationRow'
import { ReleaseRow } from './partials/rows/ReleaseRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'
import { cardStyles, getCardStylesForTheme } from './styles'

export interface NotificationCardProps {
  cardViewMode: CardViewMode
  isFocused?: boolean
  notification: EnhancedGitHubNotification
  repoIsKnown?: boolean
}

export const NotificationCard = React.memo((props: NotificationCardProps) => {
  const { cardViewMode, isFocused, notification, repoIsKnown } = props

  const repoFullName =
    (notification &&
      (notification.repository.full_name || notification.repository.name)) ||
    ''

  const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(repoFullName)

  const itemRef = useRef<View>(null)
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const themeRef = useRef<Theme | null>(null)
  const initialTheme = useTheme(theme => {
    themeRef.current = theme

    if (itemRef.current) {
      itemRef.current.setNativeProps({
        style: {
          backgroundColor: theme[getBackgroundThemeColor()],
        },
      })
    }
  })
  themeRef.current = initialTheme

  /*
  const hasPrivateAccess = useReduxState(state =>
    selectors.githubHasPrivateAccessToRepoSelector(
      state,
      repoOwnerName,
      repoName,
    ),
  )
  */

  useEffect(() => {
    if (Platform.OS === 'web' && isFocused && itemRef.current) {
      tryFocus(itemRef.current)
    }
  }, [isFocused])

  if (!notification) return null

  const {
    comment,
    id,
    repository: repo,
    saved,
    subject,
    updated_at: updatedAt,
  } = notification

  if (!subject) return null

  const isRead = isItemRead(notification)
  const isSaved = saved === true
  const isPrivate = isNotificationPrivate(notification)

  const isPrivateAndCantSee =
    isPrivate &&
    // !hasPrivateAccess &&
    !notification.enhanced

  const commit =
    notification.commit ||
    (subject.type === 'Commit' && {
      author: { avatar_url: '', login: '', html_url: '' },
      commit: {
        author: {
          name: '',
          email: '',
        },
        message: subject.title,
        url: subject.url,
      },
      url: subject.url,
    }) ||
    null

  const issue =
    notification.issue ||
    (subject.type === 'Issue' && {
      id: undefined,
      body: undefined,
      comments: undefined,
      created_at: undefined,
      labels: [] as GitHubLabel[],
      number: undefined,
      state: undefined,
      title: subject.title,
      url: subject.latest_comment_url || subject.url,
      user: { avatar_url: '', login: '', html_url: '' },
    }) ||
    null

  const pullRequest =
    notification.pullRequest ||
    (subject.type === 'PullRequest' && {
      id: undefined,
      body: undefined,
      created_at: undefined,
      comments: undefined,
      labels: [] as GitHubLabel[],
      draft: false,
      number: undefined,
      state: undefined,
      title: subject.title,
      url: subject.latest_comment_url || subject.url,
      user: { avatar_url: '', login: '', html_url: '' },
    }) ||
    null

  const release =
    notification.release ||
    (subject.type === 'Release' && {
      id: undefined,
      author: { avatar_url: '', login: '', html_url: '' },
      body: '',
      created_at: undefined,
      name: subject.title,
      tag_name: '',
      url: subject.latest_comment_url || subject.url,
    }) ||
    null

  // const isRepoInvitation = subject.type === 'RepositoryInvitation'
  // const isVulnerabilityAlert = subject.type === 'RepositoryVulnerabilityAlert'

  const cardIconDetails = getNotificationIconAndColor(notification, (issue ||
    pullRequest ||
    undefined) as any)
  const cardIconName = cardIconDetails.icon
  const _cardIconColor = cardIconDetails.color

  // const {
  //   icon: pullRequestIconName,
  //   color: _pullRequestIconColor,
  // } = pullRequest
  //   ? getPullRequestIconAndColor(pullRequest as any)
  //   : { icon: undefined, color: undefined }

  // const { icon: issueIconName, color: _issueIconColor } = issue
  //   ? getIssueIconAndColor(issue as any)
  //   : { icon: undefined, color: undefined }

  const issueOrPullRequest = issue || pullRequest

  const issueOrPullRequestNumber = issueOrPullRequest
    ? issueOrPullRequest.number ||
      getIssueOrPullRequestNumberFromUrl(issueOrPullRequest!.url)
    : undefined

  const repoAvatarDetails = {
    display_login: repoName,
    login: repoFullName,
    avatar_url: getUserAvatarByUsername(repoOwnerName || ''),
    html_url: repo.html_url || getGitHubURLForRepo(repoOwnerName!, repoName!),
  }

  const actor =
    (comment && comment.user) ||
    (commit && commit.author) ||
    (release && release.author) ||
    (issue && issue.user) ||
    (pullRequest && pullRequest.user) ||
    null

  const isBot = Boolean(
    actor && actor.login && actor.login.indexOf('[bot]') >= 0,
  )

  function getBackgroundThemeColor() {
    const backgroundThemeColors = getColumnCardThemeColors(
      themeRef.current!.backgroundColor,
    )
    const _backgroundThemeColor =
      // (isFocused && 'backgroundColorLess2') ||
      (isRead && backgroundThemeColors.read) || backgroundThemeColors.unread

    return _backgroundThemeColor
  }

  const backgroundThemeColor = getBackgroundThemeColor()

  const cardIconColor =
    _cardIconColor &&
    getReadableColor(
      _cardIconColor,
      themeRef.current![backgroundThemeColor],
      0.3,
    )

  // const issueIconColor =
  //   _issueIconColor &&
  //   getReadableColor(
  //     _issueIconColor,
  //     themeRef.current![backgroundThemeColor],
  //     0.3,
  //   )

  // const pullRequestIconColor =
  //   _pullRequestIconColor &&
  //   getReadableColor(
  //     _pullRequestIconColor,
  //     themeRef.current![backgroundThemeColor],
  //     0.3,
  //   )

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
        {/* {!!(
          repoOwnerName &&
          repoName &&
          !repoIsKnown &&
          cardViewMode === 'compact'
        ) && (
          <RepositoryRow
            key={`notification-repo-row-${repo.id}`}
            isRead={isRead}
            ownerName={repoOwnerName}
            repositoryName={repoName}
            small
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )} */}

        {!!commit && (
          <CommitRow
            key={`notification-commit-row-${commit.url}`}
            authorEmail={commit.commit.author.email}
            authorName={commit.commit.author.name}
            authorUsername={commit.author && commit.author.login}
            bold
            isPrivate={isPrivate}
            isRead={isRead}
            latestCommentUrl={subject.latest_comment_url}
            message={commit.commit.message}
            url={commit.url || commit.commit.url}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!issueOrPullRequest && (
          <IssueOrPullRequestRow
            key={`notification-issue-or-pr-row-${issueOrPullRequest.id}`}
            addBottomAnchor={!comment}
            avatarUrl={issueOrPullRequest.user.avatar_url}
            body={
              !comment &&
              !!(
                issueOrPullRequest &&
                issueOrPullRequest.state === 'open' &&
                issueOrPullRequest.body &&
                !(
                  issueOrPullRequest.created_at &&
                  issueOrPullRequest.updated_at &&
                  new Date(issueOrPullRequest.updated_at).valueOf() -
                    new Date(issueOrPullRequest.created_at).valueOf() >=
                    1000 * 60 * 60 * 24
                )
              )
                ? issueOrPullRequest.body
                : undefined
            }
            bold
            commentsCount={issueOrPullRequest.comments}
            createdAt={issueOrPullRequest.created_at}
            hideIcon
            // iconColor={issueIconColor || pullRequestIconColor}
            // iconName={issueIconName! || pullRequestIconName}
            id={issueOrPullRequest.id}
            isPrivate={isPrivate}
            isRead={isRead}
            issueOrPullRequestNumber={issueOrPullRequestNumber!}
            labels={issueOrPullRequest.labels}
            owner={repoOwnerName || ''}
            repo={repoName || ''}
            showCreationDetails={cardViewMode !== 'compact'}
            title={issueOrPullRequest.title}
            url={issueOrPullRequest.url}
            userLinkURL={issueOrPullRequest.user.html_url || ''}
            username={issueOrPullRequest.user.login || ''}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!release && (
          <ReleaseRow
            key={`notification-release-row-${repo.id}`}
            avatarUrl={release.author.avatar_url}
            body={release.body}
            bold
            hideIcon
            isPrivate={isPrivate}
            isRead={isRead}
            name={release.name || ''}
            ownerName={repoOwnerName || ''}
            repositoryName={repoName || ''}
            tagName={release.tag_name || ''}
            url={release.url}
            userLinkURL={release.author.html_url || ''}
            username={release.author.login || ''}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!comment && (
          <CommentRow
            key={`notification-comment-row-${comment.id}`}
            addBottomAnchor
            avatarUrl={comment.user.avatar_url}
            body={comment.body}
            isRead={isRead}
            url={comment.html_url}
            userLinkURL={comment.user.html_url || ''}
            username={comment.user.login}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!isPrivateAndCantSee && (
          <PrivateNotificationRow
            key={`private-notification-row-${notification.id}`}
            isRead={isRead}
            ownerId={
              (notification.repository.owner &&
                notification.repository.owner.id) ||
              undefined
            }
            repoId={repo.id}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}
      </>
    )
  }

  const Content = renderContent()

  const isSingleRow =
    withTopMarginCount <= 1 &&
    !(
      issueOrPullRequest &&
      issueOrPullRequest.labels &&
      issueOrPullRequest.labels.length
    )

  if (cardViewMode === 'compact') {
    return (
      <SpringAnimatedView
        key={`notification-card-${id}-compact-inner`}
        ref={itemRef}
        style={[
          cardStyles.compactContainer,
          isSingleRow && { alignItems: 'center' },
          {
            backgroundColor: springAnimatedTheme[backgroundThemeColor],
          },
        ]}
      >
        {!!isFocused && <CardFocusBorder />}

        {/* <CenterGuide /> */}

        {/* <View
          style={[cardStyles.compactItemFixedWidth, cardStyles.compactItemFixedHeight]}
        >
          <SpringAnimatedCheckbox analyticsLabel={undefined} size={columnHeaderItemContentSize} />
        </View>

        <Spacer width={contentPadding} /> */}

        <View style={cardStyles.compactItemFixedHeight}>
          <BookmarkButton
            isSaved={isSaved}
            itemIds={[id]}
            size={columnHeaderItemContentSize}
          />
        </View>

        <Spacer width={(contentPadding * 2) / 3} />

        {!repoIsKnown && (
          <>
            <View style={cardStyles.compactItemFixedHeight}>
              <Avatar isBot={isBot} linkURL="" small username={repoOwnerName} />
            </View>

            <Spacer width={contentPadding} />

            <View
              style={[
                cardStyles.compactItemFixedMinHeight,
                {
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  width: 100,
                  overflow: 'hidden',
                },
              ]}
            >
              {!!(repoOwnerName && repoName) && (
                <RepositoryRow
                  key={`notification-repo-row-${repo.id}`}
                  disableLeft
                  // hideOwner
                  isRead={isRead}
                  ownerName={repoOwnerName}
                  repositoryName={repoName}
                  rightContainerStyle={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    width: 100,
                  }}
                  small
                  viewMode={cardViewMode}
                  withTopMargin={false}
                />
              )}
            </View>

            <Spacer width={contentPadding} />
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
            <SpringAnimatedIcon
              name={cardIconName}
              selectable={false}
              style={{
                fontSize: columnHeaderItemContentSize,
                textAlign: 'center',
                color: cardIconColor || springAnimatedTheme.foregroundColor,
              }}
            />
          </View>

          <Spacer width={contentPadding} />

          <View style={sharedStyles.flex}>{Content}</View>
        </View>

        <Spacer width={contentPadding} />

        <View style={{ alignItems: 'flex-end' }}>
          {!!updatedAt && (
            <IntervalRefresh date={updatedAt}>
              {() => {
                const dateText = getDateSmallText(updatedAt, false)
                if (!dateText) return null

                return (
                  <SpringAnimatedText
                    numberOfLines={1}
                    style={[
                      getCardStylesForTheme(springAnimatedTheme).timestampText,
                      cardStyles.smallText,
                      { fontSize: smallerTextSize },
                    ]}
                    {...Platform.select({
                      web: { title: getFullDateText(updatedAt) },
                    })}
                  >
                    {dateText}
                  </SpringAnimatedText>
                )
              }}
            </IntervalRefresh>
          )}

          <NotificationReason
            backgroundThemeColor={backgroundThemeColor}
            isPrivate={isPrivate}
            reason={notification.reason as GitHubNotificationReason}
          />
        </View>

        <Spacer width={contentPadding / 2} />

        <View style={cardStyles.compactItemFixedHeight}>
          <ToggleReadButton
            isRead={isRead}
            itemIds={[id]}
            size={columnHeaderItemContentSize}
            type="notifications"
          />
        </View>
      </SpringAnimatedView>
    )
  }

  return (
    <SpringAnimatedView
      key={`notification-card-${id}-inner`}
      ref={itemRef}
      style={[
        cardStyles.container,
        {
          backgroundColor: springAnimatedTheme[backgroundThemeColor],
        },
      ]}
    >
      {!!isFocused && <CardFocusBorder />}

      <View
        style={[
          sharedStyles.flex,
          sharedStyles.horizontal,
          { alignItems: 'flex-start' },
        ]}
      >
        <Spacer width={contentPadding / 3} />

        <View
          style={[cardStyles.itemFixedWidth, cardStyles.itemFixedMinHeight]}
        >
          <SpringAnimatedIcon
            name={cardIconName}
            selectable={false}
            style={{
              fontSize: columnHeaderItemContentSize,
              textAlign: 'center',
              color: cardIconColor || springAnimatedTheme.foregroundColor,
            }}
          />
        </View>

        <Spacer width={contentPadding} />

        <View style={sharedStyles.flex}>
          <NotificationCardHeader
            key={`notification-card-header-${id}`}
            avatarUrl={repoAvatarDetails.avatar_url || undefined}
            backgroundThemeColor={backgroundThemeColor}
            cardIconColor={cardIconColor}
            cardIconName={cardIconName}
            date={updatedAt}
            ids={[id]}
            isBot={isBot}
            isPrivate={isPrivate}
            isRead={isRead}
            isSaved={isSaved}
            reason={notification.reason as GitHubNotificationReason}
            smallLeftColumn
            userLinkURL={repoAvatarDetails.html_url || ''}
            username={
              repoAvatarDetails.display_login || repoAvatarDetails.login
            }
          />

          <View style={[sharedStyles.flex, sharedStyles.horizontal]}>
            {/* <Spacer width={leftColumnBigSize - leftColumnSmallSize} /> */}
            <View style={sharedStyles.flex}>{Content}</View>

            <Spacer width={contentPadding / 3} />
          </View>
        </View>
      </View>
    </SpringAnimatedView>
  )
})
