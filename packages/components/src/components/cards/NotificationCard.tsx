import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  CardViewMode,
  EnhancedGitHubNotification,
  getDateSmallText,
  getFullDateText,
  getGitHubURLForRepo,
  getGitHubURLForRepoInvitation,
  getGitHubURLForSecurityAlert,
  getIssueOrPullRequestNumberFromUrl,
  getOwnerAndRepo,
  getUserAvatarByUsername,
  GitHubLabel,
  GitHubNotificationReason,
  isItemRead,
  isNotificationPrivate,
  trimNewLinesAndSpaces,
} from '@devhub/core'
import { Platform } from '../../libs/platform'
import * as colors from '../../styles/colors'
import { contentPadding, smallTextSize } from '../../styles/variables'
import { getNotificationReasonMetadata } from '../../utils/helpers/github/notifications'
import {
  getIssueIconAndColor,
  getNotificationIconAndColor,
  getPullRequestIconAndColor,
} from '../../utils/helpers/github/shared'
import { fixURL } from '../../utils/helpers/github/url'
import { findNode } from '../../utils/helpers/shared'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { Avatar } from '../common/Avatar'
import { SpringAnimatedCheckbox } from '../common/Checkbox'
import { IntervalRefresh } from '../common/IntervalRefresh'
import { Label } from '../common/Label'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { useSpringAnimatedTheme } from '../context/SpringAnimatedThemeContext'
import { NotificationCardHeader } from './partials/NotificationCardHeader'
import { CommentRow } from './partials/rows/CommentRow'
import { CommitRow } from './partials/rows/CommitRow'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { LabelsView } from './partials/rows/LabelsView'
import { PrivateNotificationRow } from './partials/rows/PrivateNotificationRow'
import { ReleaseRow } from './partials/rows/ReleaseRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'
import { getCardStylesForTheme } from './styles'

export interface NotificationCardProps {
  cardViewMode?: CardViewMode
  isFocused?: boolean
  notification: EnhancedGitHubNotification
  repoIsKnown?: boolean
}

const styles = StyleSheet.create({
  container: {
    padding: contentPadding,
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
  const springAnimatedTheme = useSpringAnimatedTheme()

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
      const node = findNode(itemRef.current)
      node.focus()
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

  const title = trimNewLinesAndSpaces(subject.title)

  const subjectType = subject.type || ''

  const commit =
    notification.commit ||
    (subjectType === 'Commit' && {
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
    (subjectType === 'Issue' && {
      id: undefined,
      body: undefined,
      comments: undefined,
      created_at: undefined,
      labels: [] as GitHubLabel[],
      state: undefined,
      title: subject.title,
      url: subject.latest_comment_url || subject.url,
      user: { avatar_url: '', login: '', html_url: '' },
    }) ||
    null

  const pullRequest =
    notification.pullRequest ||
    (subjectType === 'PullRequest' && {
      id: undefined,
      body: undefined,
      created_at: undefined,
      comments: undefined,
      labels: [] as GitHubLabel[],
      draft: false,
      state: undefined,
      title: subject.title,
      url: subject.latest_comment_url || subject.url,
      user: { avatar_url: '', login: '', html_url: '' },
    }) ||
    null

  const release =
    notification.release ||
    (subjectType === 'Release' && {
      id: undefined,
      author: { avatar_url: '', login: '', html_url: '' },
      body: '',
      created_at: undefined,
      name: subject.title,
      tag_name: '',
      url: subject.latest_comment_url || subject.url,
    }) ||
    null

  const isRepoInvitation = subjectType === 'RepositoryInvitation'
  const isVulnerabilityAlert = subjectType === 'RepositoryVulnerabilityAlert'

  const cardIconDetails = getNotificationIconAndColor(notification, (issue ||
    pullRequest ||
    undefined) as any)
  const cardIconName = isPrivateAndCantSee ? 'lock' : cardIconDetails.icon
  const cardIconColor = isPrivateAndCantSee
    ? colors.yellow
    : cardIconDetails.color

  const { icon: pullRequestIconName, color: pullRequestIconColor } = pullRequest
    ? getPullRequestIconAndColor(pullRequest as any)
    : { icon: undefined, color: undefined }

  const { icon: issueIconName, color: issueIconColor } = issue
    ? getIssueIconAndColor(issue as any)
    : { icon: undefined, color: undefined }

  const reasonDetails = getNotificationReasonMetadata(notification.reason)

  const issueOrPullRequest = issue || pullRequest

  const issueOrPullRequestNumber = issueOrPullRequest
    ? getIssueOrPullRequestNumberFromUrl(issueOrPullRequest!.url)
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

  const smallLeftColumn = false

  const backgroundThemeColor =
    // (isSelected && 'backgroundColorLess2') ||
    (isRead && 'backgroundColorDarker1') || 'backgroundColor'

  if (cardViewMode === 'compact') {
    // if (false && cardViewMode === 'compact') {
    return (
      <SpringAnimatedView
        key={`notification-card-${id}-compact-inner`}
        ref={itemRef}
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: contentPadding,
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
          style={{
            alignContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* <CenterGuide /> */}

          <View
            style={{
              height: 22,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SpringAnimatedCheckbox analyticsLabel={undefined} />
          </View>

          <Spacer height={contentPadding / 2} />

          {/* <ColumnHeaderItem
          analyticsLabel={isSaved ? 'unsave_for_later' : 'save_for_later'}
          enableBackgroundHover={!isSaved}
          hoverBackgroundThemeColor={isSaved ? undefined : 'foregroundColor'}
          fixedIconSize
          iconName="bookmark"
          iconStyle={{
            color: isSaved
              ? springAnimatedTheme.primaryBackgroundColor
              : springAnimatedTheme.foregroundColorMuted50,
          }}
          noPadding
          onPress={() => saveItemsForLater({ itemIds: [id], save: !isSaved })}
          size={18}
          style={{
            alignSelf: 'flex-start',
            alignContent: 'center',
            justifyContent: 'center',
            height: 22,
          }}
        />

        <Spacer width={contentPadding} /> */}

          <View
            style={{
              height: 22,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
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
        </View>

        <Spacer width={contentPadding} />

        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              height: 22,
              alignItems: 'center',
            }}
          >
            <Avatar
              avatarUrl={repoAvatarDetails.avatar_url}
              isBot={isBot}
              linkURL={repoAvatarDetails.html_url}
              shape={isBot ? undefined : 'circle'}
              small
              size={18}
              username={repoAvatarDetails.login}
            />

            <Spacer width={contentPadding} />

            <SpringAnimatedText
              key="repo-text"
              numberOfLines={1}
              style={{
                fontSize: smallTextSize,
                color: springAnimatedTheme.foregroundColorMuted50,
              }}
            >
              {repoFullName.toLowerCase()}
            </SpringAnimatedText>

            <IntervalRefresh key="updated-at-interval-refresh" date={updatedAt}>
              {() => {
                const dateText = getDateSmallText(updatedAt, false)
                if (!dateText) return null

                return (
                  <>
                    <Text children=" " />
                    <Text children="•" style={{ fontSize: 9, opacity: 0.2 }} />
                    <Text children=" " />

                    <Link href={subject.latest_comment_url} openOnNewTab>
                      <SpringAnimatedText
                        numberOfLines={1}
                        style={[
                          getCardStylesForTheme(springAnimatedTheme)
                            .timestampText,
                        ]}
                        {...Platform.select({
                          web: { title: getFullDateText(updatedAt) },
                        })}
                      >
                        {dateText}
                      </SpringAnimatedText>
                    </Link>
                  </>
                )
              }}
            </IntervalRefresh>

            {!!(reasonDetails && reasonDetails.label) && (
              <>
                <Spacer flex={1} minWidth={contentPadding} />

                <Label color={reasonDetails.color} isPrivate={isPrivate} small>
                  {reasonDetails.label.toLowerCase()}
                </Label>
              </>
            )}
          </View>

          <Spacer height={contentPadding / 2} />

          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              style={{
                width: 18,
                height: 22,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!!actor && (
                <Avatar
                  avatarUrl={actor.avatar_url}
                  isBot={isBot}
                  linkURL={actor.html_url}
                  shape={isBot ? undefined : 'circle'}
                  small
                  size={18}
                  username={actor.login}
                />
              )}
            </View>

            <Spacer width={contentPadding} />

            <SpringAnimatedText
              key="notification-title"
              numberOfLines={3}
              style={{
                flex: 1,
                minHeight: 22,
                lineHeight: 20,
                color: isRead
                  ? springAnimatedTheme.foregroundColorMuted50
                  : springAnimatedTheme.foregroundColor,
                fontSize: 14,
                fontWeight: isRead ? '400' : '500',
              }}
            >
              {subject.title}
            </SpringAnimatedText>
          </View>

          {!!(
            issueOrPullRequest &&
            issueOrPullRequest.labels &&
            issueOrPullRequest.labels.length
          ) && (
            <>
              <Spacer height={contentPadding / 2 - 4} />

              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Spacer width={18 + contentPadding} />

                <LabelsView
                  labels={issueOrPullRequest.labels.map(label => ({
                    key: `notification-${id}-${repoOwnerName}-${repoName}-${issueOrPullRequestNumber}-label-${label.id ||
                      label.name}`,
                    color: label.color && `#${label.color}`,
                    name: label.name.toLowerCase(),
                  }))}
                  style={{ flex: 1 }}
                />
              </View>
            </>
          )}
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
        avatarUrl={(actor && actor.avatar_url) || undefined}
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
        smallLeftColumn={smallLeftColumn}
        userLinkURL={repoAvatarDetails.html_url || ''}
        username={repoAvatarDetails.display_login || repoAvatarDetails.login}
      />

      {!!(
        repoOwnerName &&
        repoName &&
        !repoIsKnown &&
        !(actor && (actor.login === repoName || actor.login === repoFullName))
      ) && (
        <RepositoryRow
          key={`notification-repo-row-${repo.id}`}
          isRead={isRead}
          ownerName={repoOwnerName}
          repositoryName={repoName}
          smallLeftColumn={smallLeftColumn}
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
          smallLeftColumn={smallLeftColumn}
          url={commit.url || commit.commit.url}
        />
      )}

      {!!issue && (
        <IssueOrPullRequestRow
          key={`notification-issue-row-${issueOrPullRequestNumber}`}
          addBottomAnchor={!comment}
          avatarUrl={issue.user.avatar_url}
          commentsCount={issue.comments}
          createdAt={issue.created_at}
          iconColor={issueIconColor!}
          iconName={issueIconName!}
          id={issue.id}
          isRead={isRead}
          issueOrPullRequestNumber={issueOrPullRequestNumber!}
          labels={issue.labels}
          owner={repoOwnerName || ''}
          repo={repoName || ''}
          smallLeftColumn={smallLeftColumn}
          title={issue.title}
          url={issue.url}
          userLinkURL={issue.user.html_url || ''}
          username={issue.user.login || ''}
        />
      )}

      {!comment &&
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
        ) && (
          // only show body if this notification is probably from a creation event
          // because it may be for other updates
          <CommentRow
            key={`notification-issueOrPullRequest-body-${
              issueOrPullRequest.id
            }`}
            avatarUrl={issueOrPullRequest.user.avatar_url}
            body={issueOrPullRequest.body}
            isRead={isRead}
            smallLeftColumn={smallLeftColumn}
            url={issueOrPullRequest.html_url}
            userLinkURL={issueOrPullRequest.user.html_url || ''}
            username={issueOrPullRequest.user.login}
          />
        )}

      {!!pullRequest && (
        <IssueOrPullRequestRow
          key={`notification-pr-row-${issueOrPullRequestNumber}`}
          addBottomAnchor={!comment}
          avatarUrl={pullRequest.user.avatar_url}
          commentsCount={pullRequest.comments}
          createdAt={pullRequest.created_at}
          iconColor={pullRequestIconColor!}
          iconName={pullRequestIconName!}
          id={pullRequest.id}
          isRead={isRead}
          issueOrPullRequestNumber={issueOrPullRequestNumber!}
          labels={pullRequest.labels}
          owner={repoOwnerName || ''}
          repo={repoName || ''}
          smallLeftColumn={smallLeftColumn}
          title={pullRequest.title}
          url={pullRequest.url}
          userLinkURL={pullRequest.user.html_url || ''}
          username={pullRequest.user.login || ''}
        />
      )}

      {!comment &&
        !!(
          pullRequest &&
          pullRequest.state === 'open' &&
          pullRequest.body &&
          !(
            pullRequest.created_at &&
            pullRequest.updated_at &&
            new Date(pullRequest.updated_at).valueOf() -
              new Date(pullRequest.created_at).valueOf() >=
              1000 * 60 * 60 * 24
          )
        ) && (
          // only show body if this notification is probably from a creation event
          // because it may be for other updates
          <CommentRow
            key={`notification-pr-body-${pullRequest.id}`}
            avatarUrl={pullRequest.user.avatar_url}
            body={pullRequest.body}
            isRead={isRead}
            smallLeftColumn={smallLeftColumn}
            url={pullRequest.html_url}
            userLinkURL={pullRequest.user.html_url || ''}
            username={pullRequest.user.login}
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
          smallLeftColumn={smallLeftColumn}
          tagName={release.tag_name || ''}
          url={release.url}
          userLinkURL={release.author.html_url || ''}
          username={release.author.login || ''}
        />
      )}

      {!(commit || issue || pullRequest || release) && !!title && (
        <CommentRow
          key={`notification-${id}-comment-row`}
          avatarUrl=""
          body={title}
          isRead={isRead}
          smallLeftColumn={smallLeftColumn}
          userLinkURL=""
          username=""
          url={
            isRepoInvitation && repoOwnerName && repoName
              ? getGitHubURLForRepoInvitation(repoOwnerName, repoName)
              : isVulnerabilityAlert && repoOwnerName && repoName
              ? getGitHubURLForSecurityAlert(repoOwnerName, repoName)
              : fixURL(subject.latest_comment_url || subject.url)
          }
        />
      )}

      {!!comment && (
        <CommentRow
          key={`notification-comment-row-${comment.id}`}
          addBottomAnchor
          avatarUrl={comment.user.avatar_url}
          body={comment.body}
          isRead={isRead}
          smallLeftColumn={smallLeftColumn}
          url={comment.html_url}
          userLinkURL={comment.user.html_url || ''}
          username={comment.user.login}
        />
      )}

      {!!isPrivateAndCantSee && (
        <PrivateNotificationRow
          key={`private-notification-row-${notification.id}`}
          isRead={isRead}
          smallLeftColumn={smallLeftColumn}
          ownerId={
            (notification.repository.owner &&
              notification.repository.owner.id) ||
            undefined
          }
          repoId={repo.id}
        />
      )}
    </SpringAnimatedView>
  )
})
