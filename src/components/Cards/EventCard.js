// @flow

import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { List, Map, Set } from 'immutable';
import Icon from 'react-native-vector-icons/Octicons';
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

import IntervalRefresh from '../IntervalRefresh';
import ScrollableContentContainer from '../ScrollableContentContainer';
import TransparentTextOverlay from '../TransparentTextOverlay';
import OwnerAvatar from './_OwnerAvatar';
import { isArchivedFilter } from '../../selectors/shared';
import { avatarWidth, contentPadding } from '../../styles/variables';

import {
  getDateSmallText,
  getEventIconAndColor,
  getEventText,
  getRepoFullNameFromUrl,
} from '../../utils/helpers';

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
    event: GithubEvent,
    onlyOneRepository?: boolean,
    seen?: boolean,
    theme: ThemeObject,
  };

  render() {
    const { actions, event, onlyOneRepository, seen, theme, ...props } = this.props;

    if (isArchivedFilter(event)) return null;

    const {
      type,
      payload,
      actor,
      repo,
      created_at,
      merged,
    } = {
      type: event.get('type'),
      payload: event.get('payload'),
      actor: event.get('actor') || Map(),
      repo: event.get('repo'),
      created_at: event.get('created_at'),
      merged: event.get('merged'),
    };

    if (!payload) return null;

    let eventIds = Set([event.get('id')]);
    if (merged) {
      merged.forEach(mergedEvent => {
        eventIds = eventIds.add(mergedEvent.get('id'));
      });
    }

    const isPrivate = event.get('private') || event.get('public') === false;
    const {
      icon: cardIcon,
      color: cardIconColor,
      subIcon: cardSubIcon,
      subIconColor: cardSubIconColor,
    } = getEventIconAndColor(event, theme);

    const toggleEventsSeenStatus = seen
      ? actions.markEventsAsUnseen
      : actions.markEventsAsSeen
    ;

    return (
      <CardWrapper {...props} seen={seen}>
        <FullAbsoluteView style={{ top: contentPadding + avatarWidth, left: contentPadding, right: null, width: avatarWidth - smallAvatarWidth, zIndex: 1 }}>
          <TouchableWithoutFeedback onPress={() => toggleEventsSeenStatus({ eventIds })}>
            <FullAbsoluteView />
          </TouchableWithoutFeedback>
        </FullAbsoluteView>

        <Header>
          <LeftColumn>
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
                  <ScrollableContentContainer>
                    <HorizontalView>
                      <StyledText numberOfLines={1}>
                        <OwnerLogin numberOfLines={1} muted={seen}>
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
                  </ScrollableContentContainer>
                </TransparentTextOverlay>

                <StyledText numberOfLines={1} muted>
                  {isPrivate && <StyledText muted><Icon name="lock" />&nbsp;</StyledText>}
                  {getEventText(event, { repoIsKnown: onlyOneRepository })}
                </StyledText>
              </FullView>

              {
                cardSubIcon 
                ? <CardIcon name={cardSubIcon} color={cardSubIconColor || cardIconColor} />
                : <CardIcon name={cardIcon} color={cardIconColor} />
              }
            </HeaderRow>

            <FullAbsoluteView>
              <TouchableWithoutFeedback onPress={() => toggleEventsSeenStatus({ eventIds })}>
                <FullAbsoluteView />
              </TouchableWithoutFeedback>
            </FullAbsoluteView>
          </MainColumn>
        </Header>

        {
          repo && !onlyOneRepository &&
          <RepositoryRow
            actions={actions}
            repo={repo}
            pushed={type === 'PushEvent'}
            forcePushed={type === 'PushEvent' && payload.get('forced')}
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
                narrow
              />
            );
          })()
        }

        {
          payload.get('ref') &&
          <BranchRow
            type={type}
            branch={payload.get('ref')}
            repoFullName={getRepoFullNameFromUrl(
              payload.getIn(['ref', 'html_url']) || payload.getIn(['ref', 'url'])
            )}
            narrow
          />
        }

        {
          payload.get('forkee') &&
          <RepositoryRow
            actions={actions}
            repo={payload.get('forkee')}
            forcePushed={type === 'PushEvent' && payload.get('forced')}
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
              <UserListRow users={users} narrow />
            );
          })()
        }

        {
          type === 'GollumEvent' &&
          payload.get('pages') &&
          <WikiPageListRow pages={payload.get('pages')} narrow />
        }

        {
          payload.get('pull_request') &&
          <PullRequestRow
            pullRequest={payload.get('pull_request')}
            comment={payload.get('comment')}
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
              <CommitListRow commits={list} narrow />
            );
          })()
        }

        {
          payload.get('issue') &&
          <IssueRow
            issue={payload.get('issue')}
            comment={payload.get('comment')}
            narrow
          />
        }

        {
          (
            (type === 'IssuesEvent' && payload.get('action') === 'opened' &&
            payload.getIn(['issue', 'body']) &&
            <CommentRow
              body={payload.getIn(['issue', 'body'])}
              user={actor}
              url={payload.getIn(['issue', 'html_url']) || payload.getIn(['issue', 'url'])}
              narrow
            />)

            ||

            (type === 'PullRequestEvent' && payload.get('action') === 'opened' &&
            payload.getIn(['pull_request', 'body']) &&
            <CommentRow
              body={payload.getIn(['pull_request', 'body'])}
              user={actor}
              url={payload.getIn(['pull_request', 'html_url']) || payload.getIn(['pull_request', 'url'])}
              narrow
            />)

            ||

            (payload.getIn(['comment', 'body']) &&
            <CommentRow
              body={payload.getIn(['comment', 'body'])}
              user={actor}
              url={payload.getIn(['comment', 'html_url'])}
              narrow
            />)
          )
        }

        {
          payload.get('release') &&
          <ReleaseRow
            release={payload.get('release')}
            type={type}
            user={actor}
            narrow
          />
        }
      </CardWrapper>
    );
  }
}
