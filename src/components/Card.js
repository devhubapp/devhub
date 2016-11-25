// @flow

import React from 'react';
import { ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styled, { ThemeProvider } from 'styled-components/native';
import gravatar from 'gravatar';

import Avatar from './Avatar';
import RightTransparentTextOverlay from './RightTransparentTextOverlay';
import Themable from './hoc/Themable';
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
`;

const HeaderRow = styled(HorizontalView)`
  align-items: flex-start;
  justify-content: space-between;
`;

const Text = styled.Text`
  color: ${({ theme }) => theme.base04};
  line-height: 18;
  font-size: 14;
`;

const MutedText = styled(Text)`
  opacity: ${mutedTextOpacity};
`;

const Timestamp = styled(MutedText)`
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

const RepositoryStarButton = styled.TouchableOpacity`
  align-self: stretch;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  padding-horizontal: ${contentPadding};
`;

const RepositoryStarIcon = styled(Icon)`
  font-size: 16;
  color: ${({ theme }) => theme.star};
`;

const CardIcon = styled(Icon)`
  align-self: flex-start;
  margin-right: ${contentPadding - 2};
  font-size: 20;
  color: ${({ theme }) => theme.base04};
  opacity: 0.4;
`;

type Props = {
  type: GithubEvent,
  payload: Object,
  created_at: string,
  theme: ThemeObject,
};

type Context = {
  theme: ThemeObject,
};

const Card = ({
  type, payload = {}, actor = {}, repo = {}, created_at, ...props,
}: Props, context: Context) => {
  const theme = props.theme || context.theme;

  this.renderItemId = (number, icon) => {
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

  this.renderUserAvatar = ({ avatar_url, email } = {}, size) => {
    if (!avatar_url && !email) return null;

    const _size = 50 * Math.max(1, Math.ceil(size / 50));
    const uri = (avatar_url
      ? `${avatar_url}?size=${_size}`
      : `https:${gravatar.url(email, { size: _size })}`).replace('??', '?');

    return (
      <Avatar size={size} source={{ uri }} />
    );
  };

  this.renderPullRequestRow = ({
    pull_request: { number, title, user } = {},
  } = {}) => {
    let _title = (title || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_title) return null;

    return (
      <ContentRow narrow>
        <LeftColumn center>{this.renderUserAvatar(user, avatarWidth / 2)}</LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <RightTransparentTextOverlay color={theme.base01} size={contentPadding}>
              <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
                <Comment numberOfLines={1}>
                  <Icon name="git-pull-request" />&nbsp;
                  {_title}
                </Comment>
              </ScrollableContentContainer>
            </RightTransparentTextOverlay>

            <RightOfScrollableContent>
              {this.renderItemId(number)}
            </RightOfScrollableContent>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  this.renderCommitRow = ({ commits, head_commit } = {}) => {
    const commit = head_commit ? head_commit : (commits || [])[0];

    if (!commit) return null;

    const { author, message } = commit;

    let _message = (message || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_message) return null;

    return (
      <ContentRow narrow>
        <LeftColumn center>{this.renderUserAvatar(author, avatarWidth / 2)}</LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <RightTransparentTextOverlay color={theme.base01} size={contentPadding}>
              <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
                <Comment numberOfLines={1}>
                  <Icon name="git-commit" />&nbsp;
                  {_message}
                  </Comment>
              </ScrollableContentContainer>
            </RightTransparentTextOverlay>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  this.renderIssueRow = ({ actor, issue: { user, number, state, title } = {} } = {}) => {
    let _title = (title || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_title) return null;

    const { icon, color } = (() => {
      switch(state) {
        case 'closed': return { icon: 'issue-closed', color: theme.red };
        case 'reopened': return { icon: 'issue-reopened', color: theme.green };
        default: return { icon: 'issue-opened', color: theme.green };
      }
    })();

    return (
      <ContentRow narrow>
        <LeftColumn center>{this.renderUserAvatar(user || actor, avatarWidth / 2)}</LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <RightTransparentTextOverlay color={theme.base01} size={contentPadding}>
              <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
                <Comment numberOfLines={1}>
                  <Icon name={icon} color={color} />&nbsp;
                  {_title}
                </Comment>
              </ScrollableContentContainer>
            </RightTransparentTextOverlay>

            <RightOfScrollableContent>
              {this.renderItemId(number)}
            </RightOfScrollableContent>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  this.renderRepositoryRow = ({
    type,
    name, branch = 'master', forcePushed, pushed, fork,
    narrow,
  } = {}) => {
    const orgName = (name || '').split('/')[0];
    const repoName = orgName ? (name || '').split('/')[1] : name;

    if (!repoName) return null;

    const avatar_url = orgName ? `https://github.com/${orgName}.png?` : '';
    const icon = (() => {
      if (forcePushed) return 'repo-force-push';
      if (pushed) return 'repo-push';
      if (fork) return 'repo-forked';
      return 'repo';
    })();

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn center>{this.renderUserAvatar({ avatar_url }, avatarWidth / 2)}</LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <RightTransparentTextOverlay color={theme.base01} size={contentPadding}>
              <RepositoryContentContainer alwaysBounceHorizontal={false} horizontal>
                <MutedText>
                  <Icon name={icon} />&nbsp;
                  {orgName && `${orgName}/`}
                </MutedText>
                <RepositoryName>{repoName}</RepositoryName>
                {
                  branch && branch !== 'master' &&
                  <MutedText>({branch})</MutedText>
                }
              </RepositoryContentContainer>
            </RightTransparentTextOverlay>

            <RepositoryStarButton>
              <RepositoryStarIcon name="star"/>
            </RepositoryStarButton>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  this.renderCommentRow = ({
    comment: { body } = {}
  } = {}) => {
    let _body = (body || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_body) return null;

    return (
      <ContentRow narrow>
        <LeftColumn>{this.renderUserAvatar(actor, avatarWidth / 2)}</LeftColumn>

        <MainColumnRowContent>
          <Comment numberOfLines={2}>{_body}</Comment>
        </MainColumnRowContent>
      </ContentRow>
    );
  };

  const dateText = getDateSmallText(created_at);

  return (
    <CardWrapper {...props}>
      <Header>
        <LeftColumn>{this.renderUserAvatar(actor, avatarWidth)}</LeftColumn>

        <MainColumn>
          <HeaderRow>
            <View>
              <HorizontalView>
                <Username>{actor.login}</Username>
                {
                  dateText &&
                  <Timestamp> • {dateText}</Timestamp>
                }
              </HorizontalView>

              <MutedText>{getEventText(type, payload)}</MutedText>
            </View>

            <CardIcon name={getEventIcon(type, payload)}/>
          </HeaderRow>
        </MainColumn>
      </Header>

      {
        this.renderRepositoryRow({
          type,
          name: (repo || {}).name,
          pushed: type === 'PushEvent',
          forcePushed: type === 'PushEvent' && payload.forced,
        })
      }

      {
        this.renderRepositoryRow({
          type,
          name: (payload.forkee || {}).full_name,
          fork: !!payload.forkee,
          narrow : true,
        })
      }

      {this.renderPullRequestRow(payload)}

      {this.renderCommitRow(payload)}

      {this.renderIssueRow(payload)}

      {this.renderCommentRow(payload)}
    </CardWrapper>
  );
};

Card.contextTypes = {
  theme: React.PropTypes.object,
};

export default Themable(Card);
