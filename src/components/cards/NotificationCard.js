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
import { getOrgAvatar } from '../../utils/helpers/github/shared'
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

    const isPrivate = !!(repo &&
      (repo.get('private') || repo.get('public') === false))

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
            {avatarUrl &&
              <OwnerAvatar
                avatarURL={avatarUrl}
                linkURL={repo.get('html_url') || repo.get('url')}
                size={smallAvatarWidth}
              />}
          </LeftColumn>
          <MainColumn>
            <HeaderRow>
              <FullView center horizontal>
                <Label
                  color="base01"
                  isPrivate={isPrivate}
                  muted={read}
                  numberOfLines={1}
                  textColor={color}
                >
                  {label}
                </Label>

                <IntervalRefresh
                  interval={1000}
                  onRender={() => {
                    const dateText = getDateSmallText(updatedAt, ' ')
                    return (
                      dateText &&
                      <SmallText numberOfLines={1} muted>
                        &nbsp;&nbsp;{dateText}
                      </SmallText>
                    )
                  }}
                />
              </FullView>

              <CardIcon name={cardIcon} color={cardIconColor} muted={read} />
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
          !onlyOneRepository &&
          <RepositoryRow actions={actions} repo={repo} read={read} narrow />}
        {!!commit && <CommitRow commit={commit} read={read} narrow />}
        {!!issue &&
          <IssueRow issue={issue} comment={comment} read={read} narrow />}
        {!!pullRequest &&
          <PullRequestRow
            pullRequest={pullRequest}
            comment={comment}
            read={read}
            narrow
          />}
        {!!release && <ReleaseRow release={release} read={read} narrow />}
        {!(commit || issue || pullRequest) &&
          !!title &&
          <CommentRow body={title} read={read} narrow />}
        {!!comment &&
          <CommentRow
            body={comment.get('body')}
            user={comment.get('user')}
            url={comment.get('html_url')}
            read={read}
            narrow
          />}
      </CardWrapper>
    )
  }
}
