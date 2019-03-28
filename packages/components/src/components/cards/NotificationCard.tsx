import React, { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

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
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme.web'
import { Platform } from '../../libs/platform'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import { getReadableColor } from '../../utils/helpers/colors'
import { getNotificationIconAndColor } from '../../utils/helpers/github/shared'
import { tryFocus } from '../../utils/helpers/shared'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { getColumnCardThemeColors } from '../columns/EventOrNotificationColumn'
import { BookmarkButton } from '../common/BookmarkButton'
import { SpringAnimatedCheckbox } from '../common/Checkbox'
import { IntervalRefresh } from '../common/IntervalRefresh'
import { Spacer } from '../common/Spacer'
import { useTheme } from '../context/ThemeContext'
import { NotificationCardHeader } from './partials/NotificationCardHeader'
import { CommentRow } from './partials/rows/CommentRow'
import { CommitRow } from './partials/rows/CommitRow'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { PrivateNotificationRow } from './partials/rows/PrivateNotificationRow'
import { ReleaseRow } from './partials/rows/ReleaseRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'
import { getCardStylesForTheme } from './styles'

export interface NotificationCardProps {
  cardViewMode: CardViewMode
  isFocused?: boolean
  notification: EnhancedGitHubNotification
  repoIsKnown?: boolean
}

const styles = StyleSheet.create({
  container: {
    padding: contentPadding,
  },

  compactItemFixedWidth: {
    width: 22,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  compactItemFixedHeight: {
    height: 22,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

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

  const isPrivateAndCantSee = !!(
    isPrivate &&
    // !hasPrivateAccess &&
    !notification.enhanced
  )

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
  const cardIconName = isPrivateAndCantSee ? 'lock' : cardIconDetails.icon
  const _cardIconColor = isPrivateAndCantSee
    ? colors.yellow
    : cardIconDetails.color

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

  const backgroundThemeColors = getColumnCardThemeColors(
    themeRef.current.backgroundColor,
  )
  const backgroundThemeColor =
    // (isFocused && 'backgroundColorLess2') ||
    (isRead && backgroundThemeColors.read) || backgroundThemeColors.unread

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
  function getWithTopMargin() {
    const _withTopMargin = withTopMargin
    withTopMargin = true
    return _withTopMargin
  }

  function renderContent() {
    return (
      <>
        {!!(
          repoOwnerName &&
          repoName &&
          !repoIsKnown &&
          !(
            actor &&
            (actor.login === repoName || actor.login === repoFullName)
          ) &&
          cardViewMode !== 'compact'
        ) && (
          <RepositoryRow
            key={`notification-repo-row-${repo.id}`}
            isRead={isRead}
            ownerName={repoOwnerName}
            repositoryName={repoName}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!commit && (
          <CommitRow
            key={`notification-commit-row-${commit.url}`}
            authorEmail={commit.commit.author.email}
            authorName={commit.commit.author.name}
            authorUsername={commit.author && commit.author.login}
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
            commentsCount={issueOrPullRequest.comments}
            createdAt={issueOrPullRequest.created_at}
            // iconColor={issueIconColor || pullRequestIconColor}
            // iconName={issueIconName! || pullRequestIconName}
            id={issueOrPullRequest.id}
            isRead={isRead}
            issueOrPullRequestNumber={issueOrPullRequestNumber!}
            labels={issueOrPullRequest.labels}
            owner={repoOwnerName || ''}
            repo={repoName || ''}
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

  if (cardViewMode === 'compact') {
    return (
      <SpringAnimatedView
        key={`notification-card-${id}-compact-inner`}
        ref={itemRef}
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: contentPadding,
          paddingVertical: contentPadding * (2 / 3),
          backgroundColor: springAnimatedTheme[backgroundThemeColor],
        }}
      >
        {!!isFocused && (
          <SpringAnimatedView
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: 2,
              backgroundColor: springAnimatedTheme.primaryBackgroundColor,
            }}
          />
        )}

        {/* <CenterGuide /> */}

        <View
          style={[styles.compactItemFixedWidth, styles.compactItemFixedHeight]}
        >
          <SpringAnimatedCheckbox analyticsLabel={undefined} size={18} />
        </View>

        <Spacer width={contentPadding} />

        <View
          style={[styles.compactItemFixedWidth, styles.compactItemFixedHeight]}
        >
          <BookmarkButton isSaved={isSaved} itemIds={[id]} size={18} />
        </View>

        <Spacer width={contentPadding} />

        <View
          style={[styles.compactItemFixedWidth, styles.compactItemFixedHeight]}
        >
          <SpringAnimatedIcon
            name={cardIconName}
            selectable={false}
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: cardIconColor || springAnimatedTheme.foregroundColor,
            }}
          />
        </View>

        <Spacer width={contentPadding} />

        <View style={{ flex: 1 }}>{renderContent()}</View>

        <Spacer width={contentPadding} />

        <View style={styles.compactItemFixedHeight}>
          <IntervalRefresh date={updatedAt}>
            {() => {
              const dateText = getDateSmallText(updatedAt, true)
              if (!dateText) return null

              return (
                <SpringAnimatedText
                  numberOfLines={1}
                  style={
                    getCardStylesForTheme(springAnimatedTheme).timestampText
                  }
                  {...Platform.select({
                    web: { title: getFullDateText(updatedAt) },
                  })}
                >
                  {dateText}
                </SpringAnimatedText>
              )
            }}
          </IntervalRefresh>
        </View>
      </SpringAnimatedView>
    )
  }

  return (
    <SpringAnimatedView
      key={`notification-card-${id}-inner`}
      ref={itemRef}
      style={[
        styles.container,
        {
          backgroundColor: springAnimatedTheme[backgroundThemeColor],
          borderWidth: 1,
          borderColor: isFocused
            ? springAnimatedTheme.primaryBackgroundColor
            : 'transparent',
        },
      ]}
    >
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
        userLinkURL={repoAvatarDetails.html_url || ''}
        username={repoAvatarDetails.display_login || repoAvatarDetails.login}
      />

      {renderContent()}
    </SpringAnimatedView>
  )
})
