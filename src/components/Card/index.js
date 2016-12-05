// @flow

import React from 'react';
import { List, Map } from 'immutable';
import { ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';

import UserAvatar from './_UserAvatar';
import StarButton from '../buttons/StartButton';
import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';
import { contentPadding } from '../../styles/variables';
import { getDateSmallText } from '../../utils/helpers';
import { getEventIcon, getEventText } from '../../utils/helpers/github';
import type { ThemeObject } from '../../utils/types';
import type { GithubEvent } from '../../utils/types/github';

export const avatarWidth = 44;
export const innerContentPadding = contentPadding;
export const iconRightMargin = contentPadding - 2;

const CardWrapper = styled.View`
  padding: ${contentPadding};
  border-width: 0;
  border-bottom-width: 1;
  border-color: ${({ theme }) => theme.base01};
`;

const HorizontalView = styled.View`
  flex-direction: row;
`;

const Header = styled(HorizontalView)`
  align-items: center;
`;

const LeftColumn = styled.View`
  align-self: ${({ center }) => (center ? 'center' : 'auto')};
  align-items: flex-end;
  justify-content: flex-start;
  width: ${avatarWidth};
  margin-right: ${contentPadding};
`;

const MainColumn = styled.View`
  flex: 1;
  justify-content: center;
`;

const MainColumnRowContent = styled(MainColumn)`
  flex-direction: row;
  align-self: ${({ center }) => (center ? 'center' : 'auto')};
`;

const HeaderRow = styled(HorizontalView)`
  align-items: flex-start;
  justify-content: space-between;
`;

const Text = styled.Text`
  color: ${({ muted, theme }) => (muted ? theme.base05 : theme.base04)};
  line-height: 18;
  font-size: 14;
`;

const Timestamp = styled(Text)`
  font-size: 12;
`;

const Username = styled(Text)`
  font-weight: bold;
`;

const RepositoryName = styled(Text)`
  font-weight: bold;
`;

const CardItemId = styled(Text)`
  font-weight: bold;
  font-size: 12;
  opacity: 0.9;
`;

const Comment = styled(Text)`
  flex: 1;
  font-size: 14;
`;

const ContentRow = styled(HorizontalView)`
  align-items: flex-start;
  margin-top: ${({ narrow }) => (narrow ? innerContentPadding / 3 : innerContentPadding)};
`;

const HighlightContainerBase = styled(HorizontalView)`
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.base01};
  border-radius: 4;
`;

const HighlightContainer1 = styled(HighlightContainerBase)`
  background-color: ${({ theme }) => theme.base01};
`;

const HighlightContainer2 = styled(HighlightContainerBase)`
  background-color: ${({ theme }) => theme.base03};
`;

const HighlightContainerRow1 = styled(HighlightContainer1)`
  min-height: 30;
`;

const CardItemIdContainer = styled(HighlightContainer2)`
  padding-horizontal: 4;
`;

const RightOfScrollableContent = styled.View`
  margin-right: ${contentPadding};
`;

const ScrollableContentContainer = ({ contentContainerStyle, style, ...props }) => (
  <ScrollView
    style={[{ alignSelf: 'stretch' }, style]}
    contentContainerStyle={[{
      alignItems: 'center',
      paddingHorizontal: contentPadding,
    }, contentContainerStyle]}
    {...props}
  />
);

const RepositoryContentContainer = styled(ScrollableContentContainer)`
  flex-direction: row;
`;

const CardIcon = styled(Icon)`
  align-self: flex-start;
  margin-right: ${iconRightMargin};
  font-size: 20;
  color: ${({ theme }) => theme.base05};
`;

@Themable
export default class extends React.PureComponent {
  props: {
    event: GithubEvent,
    starRepo: Function,
    theme: ThemeObject,
    unstarRepo: Function,
  };

  renderItemId = (number, icon) => {
    if (!number && !icon) return null;

    return (
      <CardItemIdContainer>
        <CardItemId>
          {icon ? <Icon name={icon}/> : ''}
          {number && icon ? ' ' : ''}
          {typeof number === 'number' ? '#' : ''}
          {number}
        </CardItemId>
      </CardItemIdContainer>
    );
  };

  _wikiPageRowComponent = (props) => {
    if (!props) return null;

    const title = props.title;
    if (!title) return null;

    const { theme } = this.props;

    return (
      <ContentRow narrow>
        <LeftColumn />

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
                <Text numberOfLines={1}>
                  <Icon name="book" />&nbsp;
                  {title}
                </Text>
              </ScrollableContentContainer>
            </TransparentTextOverlay>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderWikiPageRows = (type, pages) => {
    if (type !== 'GollumEvent') return null;
    if (!(pages && pages.size > 0)) return null;

    const WikiPageRow = this._wikiPageRowComponent;
    const { theme } = this.props;

    return (
      <TransparentTextOverlay color={theme.base02} size={contentPadding} from="bottom">
        <ScrollView
          style={{ maxHeight: 120 }}
          contentContainerStyle={{ paddingBottom: contentPadding }}
          alwaysBounceVertical={false}
        >
          {
            pages.map((page) => (
              <WikiPageRow key={`wiki-page-row-${page.get('sha')}`} title={page.get('title')} />
            ))
          }
        </ScrollView>
      </TransparentTextOverlay>
    );
  };

  renderPullRequestRow = (type, pullRequest) => {
    if (!pullRequest) return null;

    const { number, state, title, user } = {
      number: pullRequest.get('number'),
      state: pullRequest.get('state'),
      title: pullRequest.get('title'),
      user: pullRequest.get('user'),
    };

    const _title = (title || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_title) return null;

    const { theme } = this.props;

    const { icon, color } = (() => {
      switch (state) {
        case 'closed':
          return { icon: 'git-pull-request', color: theme.red };
        default:
          return { icon: 'git-pull-request', color: theme.green };
      }
    })();

    return (
      <ContentRow narrow>
        <LeftColumn center>
          <UserAvatar url={user.get('avatar_url')} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
                <Comment numberOfLines={1}>
                  <Icon name={icon} color={color}/>&nbsp;
                  {_title}
                </Comment>
              </ScrollableContentContainer>
            </TransparentTextOverlay>

            <RightOfScrollableContent>
              {this.renderItemId(number)}
            </RightOfScrollableContent>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  _commitRowComponent = (props) => {
    const { author = Map(), message } = props || {};

    const _message = (message || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_message) return null;

    const { theme } = this.props;

    return (
      <ContentRow narrow>
        <LeftColumn center>
          <UserAvatar url={author.get('avatar_url')} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
                <Comment numberOfLines={1}>
                  <Icon name="git-commit" />&nbsp;
                  {_message}
                </Comment>
              </ScrollableContentContainer>
            </TransparentTextOverlay>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderCommitRows = (type, payload = Map()) => {
    const { commits, headCommit } = {
      commits: payload.get('commits'),
      headCommit: payload.get('head_commit'),
    };

    const list = (commits || List([headCommit])).filter(Boolean);
    if (!(list.size > 0)) return null;

    const firstCommit = list.first();
    const firstCommitRowProps = {
      author: firstCommit.get('author'),
      message: firstCommit.get('message'),
    };

    if (!(this._commitRowComponent(firstCommitRowProps))) return null;
    const CommitRow = this._commitRowComponent;

    const { theme } = this.props;

    return (
      <TransparentTextOverlay color={theme.base02} size={contentPadding} from="bottom">
        <ScrollView
          style={{ maxHeight: 120 }}
          contentContainerStyle={{ paddingBottom: contentPadding }}
          alwaysBounceVertical={false}
        >
          {
            list.map(item => (
              <CommitRow
                key={`commit-row-${item.get('sha')}`}
                author={item.get('author')}
                message={item.get('message')}
              />
            ))
          }
        </ScrollView>
      </TransparentTextOverlay>
    );
  };

  renderIssueRow = (type, actor, issue) => {
    if (!issue) return null;

    const { user, number, state, title } = {
      user: issue.get('user'),
      number: issue.get('number'),
      state: issue.get('state'),
      title: issue.get('title'),
    };

    const _title = (title || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_title) return null;

    const { theme } = this.props;

    const { icon, color } = (() => {
      switch (state) {
        case 'closed':
          return { icon: 'issue-closed', color: theme.red };
        default:
          return { icon: 'issue-opened', color: theme.green };
      }
    })();

    return (
      <ContentRow narrow>
        <LeftColumn center>
          <UserAvatar url={(user || actor).get('avatar_url')} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
                <Comment numberOfLines={1}>
                  <Icon name={icon} color={color}/>&nbsp;
                  {_title}
                </Comment>
              </ScrollableContentContainer>
            </TransparentTextOverlay>

            <RightOfScrollableContent>
              {this.renderItemId(number)}
            </RightOfScrollableContent>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderRepositoryRow = (type, {
    name, forcePushed, pushed, isFork, isStarred,
    narrow,
  } = {}) => {
    const orgName = (name || '').split('/')[0];
    const repoName = orgName ? (name || '').split('/')[1] : name;

    if (!repoName) return null;

    const avatarUrl = orgName ? `https://github.com/${orgName}.png` : '';

    const repoicon = (() => {
      if (forcePushed) return 'repo-force-push';
      if (pushed) return 'repo-push';
      if (isFork) return 'repo-forked';
      return 'repo';
    })();

    const { starRepo, theme, unstarRepo } = this.props;

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn center>
          <UserAvatar url={avatarUrl} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <RepositoryContentContainer alwaysBounceHorizontal={false} horizontal>
                <Text muted><Icon name={repoicon}/>&nbsp;</Text>
                {orgName && <Text muted>{orgName}/</Text>}

                <RepositoryName>{repoName}</RepositoryName>
              </RepositoryContentContainer>
            </TransparentTextOverlay>

            <StarButton
              starred={isStarred}
              starRepoFn={starRepo.bind(null, name)}
              unstarRepoFn={unstarRepo.bind(null, name)}
            />
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderBranchRow = (type, branch, { narrow } = {}) => {
    const _branch = (branch || '').split('/').pop();
    if (!_branch) return null;

    const isBranchMainEventAction = type === 'CreateEvent' || type === 'DeleteEvent';
    // if (_branch === 'master' && !isBranchMainEventAction) return null;

    const { theme } = this.props;

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn />

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <RepositoryContentContainer alwaysBounceHorizontal={false} horizontal>
                <Text numberOfLines={1} muted={!isBranchMainEventAction}>
                  <Icon name="git-branch" />&nbsp;
                  {_branch}
                </Text>
              </RepositoryContentContainer>
            </TransparentTextOverlay>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderMemberRow = (type, member) => {
    if (!member) return null;

    const _login = (member.get('login') || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_login) return null;

    const { theme } = this.props;

    return (
      <ContentRow narrow>
        <LeftColumn>
          <UserAvatar url={member.get('avatar_url')} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <RepositoryContentContainer alwaysBounceHorizontal={false} horizontal>
                <Text numberOfLines={1}>
                  <Icon name="person" />&nbsp;
                  {_login}
                </Text>
              </RepositoryContentContainer>
            </TransparentTextOverlay>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderCommentRow = (type, actor, comment) => {
    if (!comment) return null;

    const body = (comment.get('body') || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!body) return null;

    return (
      <ContentRow narrow>
        <LeftColumn>
          <UserAvatar url={actor.get('avatar_url')} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumnRowContent center>
          <Comment numberOfLines={2}>{body}</Comment>
        </MainColumnRowContent>
      </ContentRow>
    );
  };

  render() {
    const { event, ...props } = this.props;

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
      repo: event.get('repo') || Map(),
      created_at: event.get('created_at'),
    };

    if (!payload) return null;

    const dateText = getDateSmallText(created_at, '•');

    return (
      <CardWrapper {...props}>
        <Header>
          <LeftColumn>
            <UserAvatar url={actor.get('avatar_url')} size={avatarWidth} />
          </LeftColumn>

          <MainColumn>
            <HeaderRow>
              <View style={{ flex: 1 }}>
                <HorizontalView>
                  <Username>{actor.get('display_login') || actor.get('login')}</Username>
                  {
                    dateText &&
                    <Timestamp muted> • {dateText}</Timestamp>
                  }
                </HorizontalView>

                <Text numberOfLines={1} muted>{getEventText(type, payload)}</Text>
              </View>

              <CardIcon name={getEventIcon(type, payload)}/>
            </HeaderRow>
          </MainColumn>
        </Header>

        {
          this.renderRepositoryRow(type, {
            name: repo.get('name'),
            pushed: type === 'PushEvent',
            forcePushed: type === 'PushEvent' && payload.get('forced'),
            isStarred: !!repo.get('isStarred'),
          })
        }

        {this.renderBranchRow(type, payload.get('ref'), { narrow: true })}

        {
          payload.get('forkee') &&
          this.renderRepositoryRow(type, {
            name: payload.getIn(['forkee', 'full_name']),
            isFork: !!payload.get('forkee'),
            isStarred: !!payload.getIn(['forkee', 'isStarred']),
            narrow: true,
          })
        }

        {this.renderMemberRow(type, payload.get('member'))}

        {this.renderWikiPageRows(type, payload.get('pages'))}

        {this.renderPullRequestRow(type, payload.get('pull_request'))}

        {this.renderCommitRows(type, payload)}

        {this.renderIssueRow(type, payload.get('actor'), payload.get('issue'))}

        {this.renderCommentRow(type, actor, payload.get('comment'))}
      </CardWrapper>
    );
  }
}
