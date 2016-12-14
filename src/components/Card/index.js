// @flow

import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { List, Map } from 'immutable';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';

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
import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';
import UserAvatar from './_UserAvatar';
import { contentPadding, radius } from '../../styles/variables';
import { getDateSmallText } from '../../utils/helpers';
import { getEventIcon, getEventText } from '../../utils/helpers/github';
import type { ActionCreators, GithubEvent, ThemeObject } from '../../utils/types';

export const avatarWidth = 44;
export const innerContentPadding = contentPadding;
export const iconRightMargin = contentPadding - 2;

export const CardWrapper = styled.View`
  padding: ${contentPadding};
  border-width: 0;
  border-bottom-width: 1;
  border-color: ${({ theme }) => theme.base01};
  opacity: ${({ seen }) => (seen ? 0.25 : 1)};
`;

export const FullView = styled.View`
  flex: 1;
`;

export const HorizontalView = styled.View`
  flex-direction: row;
`;

export const RepositoryContentContainer = styled(ScrollableContentContainer)`
  padding-horizontal: ${contentPadding};
`;

export const Header = styled(HorizontalView)`
  align-items: center;
`;

export const LeftColumn = styled.View`
  align-self: ${({ center }) => (center ? 'center' : 'auto')};
  align-items: flex-end;
  justify-content: flex-start;
  width: ${avatarWidth};
  margin-right: ${contentPadding};
`;

export const MainColumn = styled.View`
  flex: 1;
  justify-content: center;
`;

export const MainColumnRowContent = styled(MainColumn)`
  flex-direction: row;
  align-self: ${({ center }) => (center ? 'center' : 'auto')};
`;

export const HeaderRow = styled(HorizontalView)`
  align-items: flex-start;
  justify-content: space-between;
`;

export const Text = styled.Text`
  color: ${({ muted, theme }) => (muted ? theme.base05 : theme.base04)};
  line-height: 18;
  font-size: ${({ small }) => small ? 12 : 14};
`;

export const SmallText = styled(Text)`
  font-size: 12;
`;

export const Username = styled(Text)`
  font-weight: bold;
`;

export const RepositoryName = styled(Text)`
`;

export const CardItemId = styled(Text)`
  font-weight: bold;
  font-size: 12;
  opacity: 0.9;
`;

export const CardText = styled(Text)`
  flex: 1;
  font-size: 14;
`;

export const ContentRow = styled(HorizontalView)`
  align-items: flex-start;
  margin-top: ${({ narrow }) => (narrow ? innerContentPadding / 3 : innerContentPadding)};
`;

export const HighlightContainerBase = styled(HorizontalView)`
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.base01};
  border-radius: ${radius};
`;

export const HighlightContainer1 = styled(HighlightContainerBase)`
  background-color: ${({ theme }) => theme.base01};
`;

export const HighlightContainer2 = styled(HighlightContainerBase)`
  background-color: ${({ theme }) => theme.base03};
`;

export const HighlightContainerRow1 = styled(HighlightContainer1)`
  min-height: 30;
`;

export const CardItemIdContainer = styled(HighlightContainer2)`
  padding-horizontal: 4;
`;

export const RightOfScrollableContent = styled.View`
  margin-right: ${contentPadding};
`;

export const CardIcon = styled(Icon)`
  align-self: flex-start;
  margin-left: ${contentPadding};
  margin-right: ${iconRightMargin};
  font-size: 20;
  color: ${({ theme }) => theme.base05};
`;

export const renderItemId = (number, icon) => {
  if (!number && !icon) return null;

  return (
    <CardItemIdContainer>
      <CardItemId>
        {icon ? <Icon name={icon} /> : ''}
        {number && icon ? ' ' : ''}
        {typeof number === 'number' ? '#' : ''}
        {number}
      </CardItemId>
    </CardItemIdContainer>
  );
};

@Themable
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    event: GithubEvent,
    onlyOneRepository?: boolean,
    theme: ThemeObject,
  };

  render() {
    const { actions, event, onlyOneRepository, theme, ...props } = this.props;

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

    let eventIds = List([event.get('id')]);
    if (merged) {
      merged.forEach(mergedEvent => {
        eventIds = eventIds.push(mergedEvent.get('id'));
      });
    }

    return (
      <CardWrapper {...props} seen={event.get('seen')}>
        <TouchableWithoutFeedback onPress={() => actions.toggleSeen(eventIds)}>
          <Header>
            <LeftColumn>
              <UserAvatar url={actor.get('avatar_url')} size={avatarWidth} />
            </LeftColumn>

            <MainColumn>
              <HeaderRow>
                <FullView>
                  <TransparentTextOverlay color={theme.base02} size={contentPadding} from="right">
                    <ScrollableContentContainer>
                      <HorizontalView>
                        <Username numberOfLines={1}>
                          {actor.get('display_login') || actor.get('login')}
                        </Username>
                        <IntervalRefresh
                          interval={1000}
                          onRender={
                            () => {
                              const dateText = getDateSmallText(created_at, '•');
                              return dateText && (
                                <SmallText style={{ flex: 1 }} muted> • {dateText}</SmallText>
                              );
                            }
                          }
                        />
                      </HorizontalView>
                    </ScrollableContentContainer>
                  </TransparentTextOverlay>

                  <Text numberOfLines={1} muted>{getEventText(event)}</Text>
                </FullView>

                <CardIcon name={getEventIcon(event)} />
              </HeaderRow>
            </MainColumn>
          </Header>
        </TouchableWithoutFeedback>

        {
          repo && !onlyOneRepository &&
          <RepositoryRow
            actions={actions}
            repo={repo}
            pushed={type === 'PushEvent'}
            forcePushed={type === 'PushEvent' && payload.get('forced')}
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
              />
            );
          })()
        }

        {
          payload.get('ref') &&
          <BranchRow type={type} branch={payload.get('ref')} narrow />
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
          <PullRequestRow pullRequest={payload.get('pull_request')} narrow />
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
          <IssueRow issue={payload.get('issue')} narrow />
        }

        {
          payload.get('comment') &&
          <CommentRow actor={actor} comment={payload.get('comment')} narrow />
        }

        {
          payload.get('release') &&
          <ReleaseRow release={payload.get('release')} type={type} narrow />
        }
      </CardWrapper>
    );
  }
}
