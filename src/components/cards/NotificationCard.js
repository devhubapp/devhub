// @flow

import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { List } from 'immutable'

// rows
import CommentRow from './_CommentRow'
import CommitRow from './_CommitRow'
import IssueRow from './_IssueRow'
import PullRequestRow from './_PullRequestRow'
import RepositoryRow from './_RepositoryRow'
import ReleaseRow from './_ReleaseRow'

import Label from '../Label'
import IntervalRefresh from '../IntervalRefresh'
import OwnerAvatar from './_OwnerAvatar'
import { contentPadding } from '../../styles/variables'
import { getDateSmallText, trimNewLinesAndSpaces } from '../../utils/helpers'
import {
  getNotificationIconAndColor,
  getNotificationReasonTextsAndColor,
} from '../../utils/helpers/github/notifications'
import {
  getOrgAvatar,
  getOwnerAndRepo,
} from '../../utils/helpers/github/shared'
import type { ActionCreators, GithubNotification } from '../../utils/types'

import {
  smallAvatarWidth,
  CardWrapper,
  FullView,
  FullAbsoluteView,
  Header,
  LeftColumn,
  MainColumn,
  HeaderRow,
  SmallText,
  CardIcon,
} from './__CardComponents'

export default class NotificationCard extends React.PureComponent {
  static defaultProps = {
    archived: false,
    onlyOneRepository: false,
    read: false,
  }

  props: {
    actions: ActionCreators,
    archived?: ?boolean,
    notification: GithubNotification,
    onlyOneRepository?: ?boolean,
    read?: ?boolean,
  }

  render() {
    const {
      actions,
      archived,
      onlyOneRepository,
      notification,
      read,
      ...props
    } = this.props

    if (!notification) return null
    if (archived) return null

    const comment = notification.get('comment')
    const repo = notification.get('repository')
    const subject = notification.get('subject')
    const updatedAt = notification.get('updated_at')

    if (!subject) return null

    const isPrivate = !!(
      repo &&
      (repo.get('private') || repo.get('public') === false)
    )

    const avatarUrl = getOrgAvatar(repo.getIn(['owner', 'login']))
    const notificationIds = List([notification.get('id')])
    const title = trimNewLinesAndSpaces(subject.get('title'))
    const { label: _label, color } = getNotificationReasonTextsAndColor(
      notification,
    )
    const label = _label.toLowerCase()

    const subjectType = (subject.get('type') || '').toLowerCase()
    const commit = (subjectType === 'commit' && subject) || null
    const issue = (subjectType === 'issue' && subject) || null
    const pullRequest = (subjectType === 'pullrequest' && subject) || null
    const release = (subjectType === 'release' && subject) || null

    const {
      icon: cardIcon,
      color: cardIconColor,
    } = getNotificationIconAndColor(notification)

    const toggleNotificationsReadStatus = read
      ? actions.markNotificationsAsUnread
      : actions.markNotificationsAsReadRequest

    return (
      <CardWrapper {...props} read={read}>
        <FullAbsoluteView
          top={contentPadding + smallAvatarWidth}
          left={contentPadding}
          right={null}
          width={smallAvatarWidth}
          zIndex={1}
        >
          <TouchableWithoutFeedback
            onPress={() => toggleNotificationsReadStatus({ notificationIds })}
          >
            <FullAbsoluteView />
          </TouchableWithoutFeedback>
        </FullAbsoluteView>
        <Header>
          <LeftColumn muted={read} center>
            {avatarUrl && (
              <OwnerAvatar
                avatarURL={avatarUrl}
                linkURL={repo.get('html_url') || repo.get('url')}
                size={smallAvatarWidth}
                username={getOwnerAndRepo(repo.get('name')).owner}
              />
            )}
          </LeftColumn>
          <MainColumn>
            <HeaderRow>
              <FullView center horizontal>
                <Label
                  color={color}
                  isPrivate={isPrivate}
                  numberOfLines={1}
                  outline={read}
                >
                  {label}
                </Label>

                <IntervalRefresh date={updatedAt}>
                  {() => {
                    const dateText = getDateSmallText(updatedAt, ' ')
                    return (
                      dateText && (
                        <SmallText numberOfLines={1} muted>
                          &nbsp;&nbsp;{dateText}
                        </SmallText>
                      )
                    )
                  }}
                </IntervalRefresh>
              </FullView>

              <CardIcon name={cardIcon} color={cardIconColor} />
            </HeaderRow>
            <FullAbsoluteView>
              <TouchableWithoutFeedback
                onPress={() =>
                  toggleNotificationsReadStatus({ notificationIds })}
              >
                <FullAbsoluteView />
              </TouchableWithoutFeedback>
            </FullAbsoluteView>
          </MainColumn>
        </Header>

        {!!repo &&
          !onlyOneRepository && (
            <RepositoryRow
              key={`repo-row-${repo.get('id')}`}
              actions={actions}
              repo={repo}
              read={read}
              narrow
            />
          )}

        {!!commit && (
          <CommitRow
            key={`commit-row-${commit.get('id')}`}
            commit={commit}
            read={read}
            narrow
          />
        )}

        {!!issue && (
          <IssueRow
            key={`issue-row-${repo.get('id')}`}
            issue={issue}
            comment={comment}
            read={read}
            narrow
          />
        )}

        {!!pullRequest && (
          <PullRequestRow
            key={`pr-row-${repo.get('id')}`}
            pullRequest={pullRequest}
            comment={comment}
            read={read}
            narrow
          />
        )}

        {!!release && (
          <ReleaseRow
            key={`release-row-${repo.get('id')}`}
            release={release}
            read={read}
            narrow
          />
        )}

        {!(commit || issue || pullRequest) &&
          !!title && (
            <CommentRow
              key={`subject-row-${subject.get('url')}`}
              body={title}
              read={read}
              narrow
            />
          )}

        {!!comment && (
          <CommentRow
            key={`comment-row-${comment.get('id')}`}
            body={comment.get('body')}
            user={comment.get('user')}
            url={comment.get('html_url')}
            read={read}
            narrow
          />
        )}
      </CardWrapper>
    )
  }
}
