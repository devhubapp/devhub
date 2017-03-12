// @flow

import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { List, Map } from 'immutable';
import { withTheme } from 'styled-components/native';

// rows
import BranchRow from './_BranchRow';
import CommentRow from './_CommentRow';
import CommitListRow from './_CommitListRow';
import IssueRow from './_IssueRow';
import PullRequestRow from './_PullRequestRow';
import ReleaseRow from './_ReleaseRow';
import RepositoryRow from './_RepositoryRow';
import RepositoryListRow from './_RepositoryListRow';
import UserListRow from './_UserListRow';
import WikiPageListRow from './_WikiPageListRow';

import Icon from '../../libs/icon';
import IntervalRefresh from '../IntervalRefresh';
import ScrollableContentContainer from '../ScrollableContentContainer';
import TransparentTextOverlay from '../TransparentTextOverlay';
import OwnerAvatar from './_OwnerAvatar';
import { avatarWidth, contentPadding } from '../../styles/variables';

import { getDateSmallText } from '../../utils/helpers';

import {
  getEventIconAndColor,
  getEventText,
  getEventIdsFromEventIncludingMerged,
} from '../../utils/helpers/github/events';

import { getRepoFullNameFromUrl } from '../../utils/helpers/github/url';

import type { ActionCreators, GithubEvent, ThemeObject } from '../../utils/types';

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
} from './__CardComponents';

@withTheme
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    archived?: boolean,
    event: GithubEvent,
    onlyOneRepository?: boolean,
    read?: boolean,
    theme: ThemeObject,
  };

  render() {
    const {
      actions,
      archived,
      event,
      onlyOneRepository,
      read,
      theme,
      ...props
    } = this.props;

    if (!event) return null;
    if (archived) return null;

    const {
      type,
      payload,
      actor,
      repo,
      created_at,
    } = {
      type: event.get('type'),
      payload: event.get('payload'),
      actor: event.get('actor') || Map(),
      repo: event.get('repo'),
      created_at: event.get('created_at'),
    };

    if (!payload) return null;

    const eventIds = getEventIdsFromEventIncludingMerged(event);

    const isPrivate = !!event.get('private') || event.get('public') === false;
    const {
      icon: cardIcon,
      color: cardIconColor,
      subIcon: cardSubIcon,
      subIconColor: cardSubIconColor,
    } = getEventIconAndColor(event, theme);

    const toggleEventsReadStatus = read
      ? actions.markEventsAsUnread
      : actions.markEventsAsRead
    ;

    return (
      <CardWrapper {...props}>
        <FullAbsoluteView style={{ top: contentPadding + avatarWidth, left: contentPadding, right: null, width: avatarWidth - smallAvatarWidth, zIndex: 1 }}>
          <TouchableWithoutFeedback onPress={() => toggleEventsReadStatus({ eventIds })}>
            <FullAbsoluteView />
          </TouchableWithoutFeedback>
        </FullAbsoluteView>

        <Header>
          <LeftColumn muted={read}>
            <OwnerAvatar
              avatarURL={actor.get('avatar_url')}
              linkURL={actor.get('html_url') || actor.get('url')}
              size={avatarWidth}
            />
          </LeftColumn>

          <MainColumn>
            <HeaderRow>
              <FullView>
                <TransparentTextOverlay color={theme.base02} size={contentPadding} from="right">
                  <HorizontalView>
                    <StyledText numberOfLines={1}>
                      <OwnerLogin numberOfLines={1} muted={read}>
                        {actor.get('display_login') || actor.get('login')}
                      </OwnerLogin>

                      <IntervalRefresh
                        interval={1000}
                        onRender={
                          () => {
                            const dateText = getDateSmallText(created_at, '•');
                            return dateText && (
                              <SmallText muted>&nbsp;•&nbsp;{dateText}</SmallText>
                            );
                          }
                        }
                      />
                    </StyledText>
                  </HorizontalView>
                </TransparentTextOverlay>

                <StyledText numberOfLines={1} muted>
                  {!!isPrivate && <StyledText muted><Icon name="lock" />&nbsp;</StyledText>}
                  {getEventText(event, { repoIsKnown: onlyOneRepository })}
                </StyledText>
              </FullView>

              {
                cardSubIcon
                ? <CardIcon name={cardSubIcon} color={cardSubIconColor || cardIconColor} muted={read} />
                : <CardIcon name={cardIcon} color={cardIconColor} muted={read} />
              }
            </HeaderRow>

            <FullAbsoluteView>
              <TouchableWithoutFeedback onPress={() => toggleEventsReadStatus({ eventIds })}>
                <FullAbsoluteView />
              </TouchableWithoutFeedback>
            </FullAbsoluteView>
          </MainColumn>
        </Header>

        {
          !!repo && !onlyOneRepository &&
          <RepositoryRow
            actions={actions}
            repo={repo}
            pushed={type === 'PushEvent'}
            forcePushed={type === 'PushEvent' && payload.get('forced')}
            read={read}
            narrow
          />
        }

        {
          (() => {
            const repos = (payload.get('repos') || List()).filter(Boolean);

            if (!(repos.size > 0)) return null;

            return (
              <RepositoryListRow
                actions={actions}
                repos={repos}
                pushed={type === 'PushEvent'}
                forcePushed={type === 'PushEvent' && payload.get('forced')}
                read={read}
                narrow
              />
            );
          })()
        }

        {
          !!payload.get('ref') &&
          <BranchRow
            type={type}
            branch={payload.get('ref')}
            repoFullName={getRepoFullNameFromUrl(
              payload.getIn(['ref', 'html_url']) || payload.getIn(['ref', 'url']),
            )}
            read={read}
            narrow
          />
        }

        {
          !!payload.get('forkee') &&
          <RepositoryRow
            actions={actions}
            repo={payload.get('forkee')}
            forcePushed={type === 'PushEvent' && payload.get('forced')}
            read={read}
            isFork
            narrow
          />
        }

        {
          (() => {
            const member = payload.get('member');
            const users = (payload.get('users') || List([member])).filter(Boolean);

            if (!(users.size > 0)) return null;

            return (
              <UserListRow users={users} read={read} narrow />
            );
          })()
        }

        {
          type === 'GollumEvent' &&
          !!payload.get('pages') &&
          <WikiPageListRow pages={payload.get('pages')} read={read} narrow />
        }

        {
          !!payload.get('pull_request') &&
          <PullRequestRow
            pullRequest={payload.get('pull_request')}
            comment={payload.get('comment')}
            read={read}
            narrow
          />
        }

        {
          (() => {
            const { commits, headCommit } = {
              commits: payload.get('commits'),
              headCommit: payload.get('head_commit'),
            };

            const list = (commits || List([headCommit])).filter(Boolean);
            if (!(list.size > 0)) return null;

            return (
              <CommitListRow commits={list} read={read} narrow />
            );
          })()
        }

        {
          !!payload.get('issue') &&
          <IssueRow
            issue={payload.get('issue')}
            comment={payload.get('comment')}
            read={read}
            narrow
          />
        }

        {
          (
            (type === 'IssuesEvent' && payload.get('action') === 'opened' &&
            !!payload.getIn(['issue', 'body']) &&
            <CommentRow
              body={payload.getIn(['issue', 'body'])}
              user={actor}
              url={payload.getIn(['issue', 'html_url']) || payload.getIn(['issue', 'url'])}
              read={read}
              narrow
            />)

            ||

            (type === 'PullRequestEvent' && payload.get('action') === 'opened' &&
            !!payload.getIn(['pull_request', 'body']) &&
            <CommentRow
              body={payload.getIn(['pull_request', 'body'])}
              user={actor}
              url={payload.getIn(['pull_request', 'html_url']) || payload.getIn(['pull_request', 'url'])}
              read={read}
              narrow
            />)

            ||

            (!!payload.getIn(['comment', 'body']) &&
            <CommentRow
              body={payload.getIn(['comment', 'body'])}
              user={actor}
              url={payload.getIn(['comment', 'html_url'])}
              read={read}
              narrow
            />)
          )
        }

        {
          !!payload.get('release') &&
          <ReleaseRow
            release={payload.get('release')}
            type={type}
            user={actor}
            read={read}
            narrow
          />
        }
      </CardWrapper>
    );
  }
}
