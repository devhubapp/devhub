// @flow

import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { List, Map } from 'immutable'
import { withTheme } from 'styled-components/native'

// rows
import BranchRow from './_BranchRow'
import CommentRow from './_CommentRow'
import CommitListRow from './_CommitListRow'
import IssueRow from './_IssueRow'
import PullRequestRow from './_PullRequestRow'
import ReleaseRow from './_ReleaseRow'
import RepositoryRow from './_RepositoryRow'
import RepositoryListRow from './_RepositoryListRow'
import UserListRow from './_UserListRow'
import WikiPageListRow from './_WikiPageListRow'

import Icon from '../../libs/icon'
import IntervalRefresh from '../IntervalRefresh'
import TransparentTextOverlay from '../TransparentTextOverlay'
import OwnerAvatar from './_OwnerAvatar'
import { avatarWidth, contentPadding } from '../../styles/variables'

import { getDateSmallText } from '../../utils/helpers'

import {
  getEventIconAndColor,
  getEventText,
  getEventIdsFromEventIncludingMerged,
} from '../../utils/helpers/github/events'

import { getRepoFullNameFromUrl } from '../../utils/helpers/github/url'

import type {
  ActionCreators,
  GithubEvent,
  ThemeObject,
} from '../../utils/types'

import {
  smallAvatarWidth,
  CardWrapper,
  FullView,
  FullAbsoluteView,
  HorizontalView,
  Header,
  LeftColumn,
  MainColumn,
  HeaderRow,
  StyledText,
  SmallText,
  OwnerLogin,
  CardIcon,
} from './__CardComponents'

@withTheme
export default class EventCard extends React.PureComponent {
  props: {
    actions: ActionCreators,
    archived?: boolean,
    event: GithubEvent,
    onlyOneRepository?: boolean,
    read?: boolean,
    theme: ThemeObject,
  }

  render() {
    const {
      actions,
      archived,
      event,
      onlyOneRepository,
      read,
      theme,
      ...props
    } = this.props

    if (!event) return null
    if (archived) return null

    const { type, payload, actor, repo, createdAt } = {
      type: event.get('type'),
      payload: event.get('payload'),
      actor: event.get('actor') || Map(),
      repo: event.get('repo'),
      createdAt: event.get('created_at'),
    }

    if (!payload) return null

    const eventIds = getEventIdsFromEventIncludingMerged(event)

    const isPrivate = !!(
      event.get('private') ||
      event.get('public') === false ||
      (repo && (repo.get('private') || repo.get('public') === false))
    )

    const {
      icon: cardIcon,
      color: cardIconColor,
      subIcon: cardSubIcon,
      subIconColor: cardSubIconColor,
    } = getEventIconAndColor(event, theme)

    const toggleEventsReadStatus = read
      ? actions.markEventsAsUnread
      : actions.markEventsAsRead

    return (
      <CardWrapper {...props}>
        <FullAbsoluteView
          style={{
            top: contentPadding + avatarWidth,
            left: contentPadding,
            right: null,
            width: avatarWidth - smallAvatarWidth,
            zIndex: 1,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => toggleEventsReadStatus({ eventIds })}
          >
            <FullAbsoluteView />
          </TouchableWithoutFeedback>
        </FullAbsoluteView>

        <Header>
          <LeftColumn muted={read}>
            <OwnerAvatar
              avatarURL={actor.get('avatar_url')}
              linkURL={actor.get('html_url') || actor.get('url')}
              size={avatarWidth}
              username={actor.get('login')}
            />
          </LeftColumn>

          <MainColumn>
            <HeaderRow>
              <FullView>
                <TransparentTextOverlay
                  color={theme.base02}
                  size={contentPadding}
                  from="right"
                >
                  <HorizontalView>
                    <StyledText numberOfLines={1}>
                      <OwnerLogin numberOfLines={1} muted={read}>
                        {actor.get('display_login') || actor.get('login')}
                      </OwnerLogin>

                      <IntervalRefresh date={createdAt}>
                        {() => {
                          const dateText = getDateSmallText(createdAt, '•')
                          return (
                            dateText &&
                            <SmallText muted>
                              &nbsp;•&nbsp;{dateText}
                            </SmallText>
                          )
                        }}
                      </IntervalRefresh>
                    </StyledText>
                  </HorizontalView>
                </TransparentTextOverlay>

                <StyledText numberOfLines={1} muted>
                  {Boolean(isPrivate) &&
                    <StyledText muted>
                      <Icon name="lock" />
                    </StyledText>}
                  {getEventText(event, { repoIsKnown: onlyOneRepository })}
                </StyledText>
              </FullView>

              {cardSubIcon
                ? <CardIcon
                    name={cardSubIcon}
                    color={cardSubIconColor || cardIconColor}
                  />
                : <CardIcon name={cardIcon} color={cardIconColor} />}
            </HeaderRow>

            <FullAbsoluteView>
              <TouchableWithoutFeedback
                onPress={() => toggleEventsReadStatus({ eventIds })}
              >
                <FullAbsoluteView />
              </TouchableWithoutFeedback>
            </FullAbsoluteView>
          </MainColumn>
        </Header>

        {Boolean(repo) &&
          !onlyOneRepository &&
          <RepositoryRow
            key={`repo-row-${repo.get('id')}`}
            actions={actions}
            repo={repo}
            pushed={type === 'PushEvent'}
            forcePushed={type === 'PushEvent' && payload.get('forced')}
            read={read}
            narrow
          />}

        {(() => {
          const repos = payload.get('repos') || List()

          if (!(repos.size > 0)) return null
          const ids = repos.filter(Boolean).map(_item => _item.get('id'))

          return (
            <RepositoryListRow
              key={`repo-list-row-${ids.join('-')}`}
              actions={actions}
              repos={repos}
              pushed={type === 'PushEvent'}
              forcePushed={type === 'PushEvent' && payload.get('forced')}
              read={read}
              narrow
            />
          )
        })()}

        {Boolean(payload.get('ref')) &&
          <BranchRow
            key={`branch-row-${payload.get('ref')}`}
            type={type}
            branch={payload.get('ref')}
            repoFullName={getRepoFullNameFromUrl(
              repo && (repo.get('html_url') || repo.get('url')),
            )}
            read={read}
            narrow
          />}

        {Boolean(payload.get('forkee')) &&
          <RepositoryRow
            key={`fork-row-${payload.getIn(['forkee', 'id'])}`}
            actions={actions}
            repo={payload.get('forkee')}
            forcePushed={type === 'PushEvent' && payload.get('forced')}
            read={read}
            isFork
            narrow
          />}

        {(() => {
          const member = payload.get('member')
          const users = payload.get('users') || List([member])

          if (!(users.size > 0)) return null
          const ids = users.filter(Boolean).map(_item => _item.get('id'))

          return (
            <UserListRow
              key={`user-list-row-${ids.join('-')}`}
              users={users}
              read={read}
              narrow
            />
          )
        })()}

        {type === 'GollumEvent' &&
          (() => {
            const pages = payload.get('pages')

            if (!(pages.size > 0)) return null
            const ids = pages.filter(Boolean).map(_item => _item.get('id'))

            return (
              <WikiPageListRow
                key={`wiki-list-row-${ids.join('-')}`}
                pages={payload.get('pages')}
                read={read}
                narrow
              />
            )
          })()}

        {Boolean(payload.get('pull_request')) &&
          <PullRequestRow
            key={`pr-row-${payload.getIn(['pull_request', 'id'])}`}
            pullRequest={payload.get('pull_request')}
            comment={payload.get('comment')}
            read={read}
            narrow
          />}

        {(() => {
          const { commits, headCommit } = {
            commits: payload.get('commits'),
            headCommit: payload.get('head_commit'),
          }

          const list = commits || List([headCommit])
          if (!(list.size > 0)) return null

          const ids = list.filter(Boolean).map(_item => _item.get('id'))

          return (
            <CommitListRow
              key={`commit-list-row-${ids.join('-')}`}
              commits={list}
              read={read}
              narrow
            />
          )
        })()}

        {Boolean(payload.get('issue')) &&
          <IssueRow
            key={`issue-row-${payload.getIn(['issue', 'id'])}`}
            issue={payload.get('issue')}
            comment={payload.get('comment')}
            read={read}
            narrow
          />}

        {(type === 'IssuesEvent' &&
          payload.get('action') === 'opened' &&
          Boolean(payload.getIn(['issue', 'body'])) &&
          <CommentRow
            key={`issue-body-row-${payload.getIn(['issue', 'id'])}`}
            body={payload.getIn(['issue', 'body'])}
            user={actor}
            url={
              payload.getIn(['issue', 'html_url']) ||
              payload.getIn(['issue', 'url'])
            }
            read={read}
            narrow
          />) ||
          (type === 'PullRequestEvent' &&
            payload.get('action') === 'opened' &&
            Boolean(payload.getIn(['pull_request', 'body'])) &&
            <CommentRow
              key={`pr-body-row-${payload.getIn(['pull_request', 'id'])}`}
              body={payload.getIn(['pull_request', 'body'])}
              user={actor}
              url={
                payload.getIn(['pull_request', 'html_url']) ||
                payload.getIn(['pull_request', 'url'])
              }
              read={read}
              narrow
            />) ||
          (Boolean(payload.getIn(['comment', 'body'])) &&
            <CommentRow
              key={`comment-row-${payload.getIn(['comment', 'id'])}`}
              body={payload.getIn(['comment', 'body'])}
              user={actor}
              url={payload.getIn(['comment', 'html_url'])}
              read={read}
              narrow
            />)}

        {Boolean(payload.get('release')) &&
          <ReleaseRow
            key={`release-row-${payload.getIn(['release', 'id'])}`}
            release={payload.get('release')}
            type={type}
            user={actor}
            read={read}
            narrow
          />}
      </CardWrapper>
    )
  }
}
