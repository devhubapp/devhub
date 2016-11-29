// @flow

import React from 'react';
import { ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';
import gravatar from 'gravatar';

import Avatar from './Avatar';
import StarButton from './buttons/StartButton';
import Themable from './hoc/Themable';
import TransparentTextOverlay from './TransparentTextOverlay';
import { contentPadding, mutedTextOpacity } from '../styles/variables';
import { getDateSmallText } from '../utils/helpers/';
import { getEventIcon, getEventText } from '../utils/helpers/github';
import type { ThemeObject } from '../utils/types';
import type { GithubEvent } from '../utils/types/github';

const avatarWidth = 44;
const innerContentPadding = contentPadding;

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
  align-self: ${({ center }) => center ? 'center' : 'auto'};
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
  align-self: ${({ center }) => center ? 'center' : 'auto'};
`;

const HeaderRow = styled(HorizontalView)`
  align-items: flex-start;
  justify-content: space-between;
`;

const Text = styled.Text`
  color: ${({ theme }) => theme.base04};
  line-height: 18;
  font-size: 14;
  opacity: ${({ muted }) => muted ? mutedTextOpacity : 1};
`;

const Timestamp = styled(Text)`
  font-size: 12;
  opacity: ${mutedTextOpacity};
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
  margin-top: ${({ narrow }) => narrow ? innerContentPadding / 3 : innerContentPadding};
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
  margin-right: ${contentPadding - 2};
  font-size: 20;
  color: ${({ theme }) => theme.base04};
  opacity: 0.4;
`;

@Themable
export default class extends React.Component {
  props: {
    event: GithubEvent,
    theme: ThemeObject,
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

  renderUserAvatar = ({ avatar_url, email } = {}, size) => {
    if (!avatar_url && !email) return null;

    const _size = 100 * Math.max(1, Math.ceil(size / 100));
    const uri = (avatar_url
      ? avatar_url // transparency bug when using size attribute ?size=${_size}
      : `https:${gravatar.url(email, { size: _size })}`).replace('??', '?');

    return (
      <Avatar size={size} source={{ uri }}/>
    );
  };

  _renderWikiPageRow = ({ title } = {}) => {
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
                  <Icon name="book"/>&nbsp;
                  {title}
                </Text>
              </ScrollableContentContainer>
            </TransparentTextOverlay>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderWikiPageRows = (type, { pages = [] } = {}) => {
    if (type !== 'GollumEvent') return null;
    if (!(pages && pages.length > 0)) return null;

    const WikiPageRow = this._renderWikiPageRow;
    const { theme } = this.props;

    return (
      <TransparentTextOverlay color={theme.base02} size={contentPadding} from="bottom">
        <ScrollView
          style={{ maxHeight: 120 }}
          contentContainerStyle={{ paddingBottom: contentPadding }}
          alwaysBounceVertical={false}
        >
          {
            pages.map(({ sha, title }) => (
              <WikiPageRow key={`wiki-page-row-${sha}`} title={title}/>
            ))
          }
        </ScrollView>
      </TransparentTextOverlay>
    );
  };

  renderPullRequestRow = (type, {
    pull_request: { number, state, title, user } = {},
  } = {}) => {
    let _title = (title || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
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
        <LeftColumn center>{this.renderUserAvatar(user, avatarWidth / 2)}</LeftColumn>

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

  _renderCommitRow = ({ author, message } = {}) => {
    let _message = (message || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_message) return null;

    const { theme } = this.props;

    return (
      <ContentRow narrow>
        <LeftColumn center>{this.renderUserAvatar(author, avatarWidth / 2)}</LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
                <Comment numberOfLines={1}>
                  <Icon name="git-commit"/>&nbsp;
                  {_message}
                </Comment>
              </ScrollableContentContainer>
            </TransparentTextOverlay>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderCommitRows = (type, { commits, head_commit } = {}) => {
    const commit = head_commit ? head_commit : (commits || [])[0];
    if (!commit) return null;

    const { message } = commit;

    let _message = (message || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_message) return null;

    const CommitRow = this._renderCommitRow;
    const list = commits || [head_commit];
    const { theme } = this.props;

    return (
      <TransparentTextOverlay color={theme.base02} size={contentPadding} from="bottom">
        <ScrollView
          style={{ maxHeight: 120 }}
          contentContainerStyle={{ paddingBottom: contentPadding }}
          alwaysBounceVertical={false}
        >
          {
            list.map(({ sha, author, message }) => (
              <CommitRow key={`commit-row-${sha}`} author={author} message={message}/>
            ))
          }
        </ScrollView>
      </TransparentTextOverlay>
    );
  };

  renderIssueRow = (type, { actor, issue: { user, number, state, title } = {} } = {}) => {
    let _title = (title || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
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
        <LeftColumn center>{this.renderUserAvatar(user || actor, avatarWidth / 2)}</LeftColumn>

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
    name, forcePushed, pushed, isFork, isOrg,
    narrow,
  } = {}) => {
    const orgName = (name || '').split('/')[0];
    const repoName = orgName ? (name || '').split('/')[1] : name;

    if (!repoName) return null;

    const avatar_url = orgName ? `https://github.com/${orgName}.png` : '';

    const ownerIcon = (() => {
      if (isOrg) return 'organization';
      return 'person';
    })();

    const repoicon = (() => {
      if (forcePushed) return 'repo-force-push';
      if (pushed) return 'repo-push';
      if (isFork) return 'repo-forked';
      return 'repo';
    })();

    const { theme } = this.props;

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn center>{this.renderUserAvatar({ avatar_url }, avatarWidth / 2)}</LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <RepositoryContentContainer alwaysBounceHorizontal={false} horizontal>
                <Text muted><Icon name={repoicon}/>&nbsp;</Text>
                {orgName && <Text muted>{orgName}/</Text>}

                <RepositoryName>{repoName}</RepositoryName>
              </RepositoryContentContainer>
            </TransparentTextOverlay>

            <StarButton />
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderBranchRow = (type, {
    branch = 'master',
    narrow,
  } = {}) => {
    const _branch = (branch || '').split('/').pop();
    if (!_branch) return null;

    const isBranchMainEventAction = type === 'CreateEvent' || type === 'DeleteEvent';
    if (_branch === 'master' && !isBranchMainEventAction) return;

    const { theme } = this.props;

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn />

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <RepositoryContentContainer alwaysBounceHorizontal={false} horizontal>
                <Text numberOfLines={1} muted={!isBranchMainEventAction}>
                  <Icon name="git-branch"/>&nbsp;
                  {_branch}
                </Text>
              </RepositoryContentContainer>
            </TransparentTextOverlay>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderMemberRow = (type, { member = {} } = {}) => {
    let _login = (member.login || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_login) return null;

    const { theme } = this.props;

    return (
      <ContentRow narrow>
        <LeftColumn>{this.renderUserAvatar(member, avatarWidth / 2)}</LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
              <RepositoryContentContainer alwaysBounceHorizontal={false} horizontal>
                <Text numberOfLines={1}>
                  <Icon name="person"/>&nbsp;
                  {_login}
                </Text>
              </RepositoryContentContainer>
            </TransparentTextOverlay>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  renderCommentRow = (type, actor, {
    comment: { body } = {}
  } = {}) => {
    let _body = (body || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_body) return null;

    return (
      <ContentRow narrow>
        <LeftColumn>{this.renderUserAvatar(actor, avatarWidth / 2)}</LeftColumn>

        <MainColumnRowContent center>
          <Comment numberOfLines={2}>{_body}</Comment>
        </MainColumnRowContent>
      </ContentRow>
    );
  };

  render() {
    const { event, ...props } = this.props;
    const { type, payload = {}, actor = {}, repo = {}, org = {}, created_at } = event;

    const dateText = getDateSmallText(created_at, '•');

    return (
      <CardWrapper {...props}>
        <Header>
          <LeftColumn>{this.renderUserAvatar(actor, avatarWidth)}</LeftColumn>

          <MainColumn>
            <HeaderRow>
              <View style={{ flex: 1 }}>
                <HorizontalView>
                  <Username>{actor.display_login || actor.login}</Username>
                  {
                    dateText &&
                    <Timestamp> • {dateText}</Timestamp>
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
            name: (repo || {}).name,
            pushed: type === 'PushEvent',
            forcePushed: type === 'PushEvent' && payload.forced,
            isOrg: !!org.login,
          })
        }

        {
          this.renderBranchRow(type, {
            name: (repo || {}).name,
            branch: payload.ref,
            narrow: true,
          })
        }

        {
          this.renderRepositoryRow(type, {
            name: (payload.forkee || {}).full_name,
            isFork: !!payload.forkee,
            isOrg: !!org.login,
            narrow: true,
          })
        }

        {this.renderMemberRow(type, payload)}

        {this.renderWikiPageRows(type, payload)}

        {this.renderPullRequestRow(type, payload)}

        {this.renderCommitRows(type, payload)}

        {this.renderIssueRow(type, payload)}

        {this.renderCommentRow(type, actor, payload)}
      </CardWrapper>
    );
  };
}
