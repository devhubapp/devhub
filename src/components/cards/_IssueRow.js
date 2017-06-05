// @flow

import React from 'react'

import OwnerAvatar from './_OwnerAvatar'
import TouchableRow from './__TouchableRow'

import {
  CardItemId,
  smallAvatarWidth,
  CardText,
  Icon,
  RightOfScrollableContent,
  StyledText,
} from './__CardComponents'

import { trimNewLinesAndSpaces } from '../../utils/helpers'
import { getIssueIconAndColor } from '../../utils/helpers/github/shared'
import type { GithubComment, GithubIssue, ThemeObject } from '../../utils/types'

export default class IssueRow extends React.PureComponent {
  props: {
    comment?: GithubComment,
    issue: GithubIssue,
    narrow?: boolean,
    read?: boolean,
    theme?: ThemeObject,
  }

  render() {
    const { comment, issue, read, theme, ...props } = this.props

    if (!issue) return null

    const user = issue.get('user')
    const number = issue.get('number')
    const title = issue.get('title')

    const _title = trimNewLinesAndSpaces(title)
    if (!_title) return null

    const { icon, color } = getIssueIconAndColor(issue, theme)

    const byText = user && user.get('login') ? `@${user.get('login')}` : ''

    // issue links will send to comment if comment was not loaded by app yet
    const url = comment && !comment.get('body') && comment.get('html_url')
      ? comment.get('html_url')
      : issue.get('html_url') || issue.get('url')

    return (
      <TouchableRow
        left={
          !!user &&
          <OwnerAvatar
            avatarURL={user.get('avatar_url')}
            linkURL={user.get('html_url') || user.get('url')}
            size={smallAvatarWidth}
            username={user.get('login')}
          />
        }
        read={read}
        right={
          <RightOfScrollableContent>
            <CardItemId
              number={number}
              read={read}
              url={issue.get('html_url') || issue.get('url')}
            />
          </RightOfScrollableContent>
        }
        url={url}
        {...props}
      >
        <CardText numberOfLines={1} muted={read}>
          <StyledText muted>
            <Icon name={icon} color={color} muted={read} />&nbsp;
          </StyledText>
          {_title}
          {!!byText && <StyledText muted small> by {byText}</StyledText>}
        </CardText>
      </TouchableRow>
    )
  }
}
