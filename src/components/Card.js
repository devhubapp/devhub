// @flow

import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';
import gravatar from 'gravatar';

import Avatar from './Avatar';
import { contentPadding } from '../styles/variables';
import { getDateSmallText } from '../utils/helpers/';
import { getEventIcon, getEventText } from '../utils/helpers/github';

const avatarWidth = 36;
const innerContentPadding = contentPadding;

const Card = styled.View`
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
  opacity: 0.7;
`;

const Timestamp = styled(MutedText)`
  font-size: 12;
`;

const Username = styled(Text)`
  font-weight: bold;
`;

const OrganizationName = styled(MutedText)`
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
  opacity: 0.9;
`;

const ContentRow = styled(HorizontalView)`
  align-items: flex-start;
  margin-top: ${({ narrow }) => narrow ? innerContentPadding / 2 : innerContentPadding};
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

const ScrollableContentContainer = styled.ScrollView`
  padding-horizontal: ${contentPadding};
`;

const RightOfScrollableContent = styled.View`
  margin-right: ${contentPadding};
`;

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
};

export default ({ type, payload = {}, actor = {}, repo = {}, created_at, ...props }: Props) => {
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

    const uri = avatar_url
      ? avatar_url
      : `https:${gravatar.url(email, { size: Math.max(100, size) })}`;

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
            <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
              <Comment numberOfLines={1}>{_title}</Comment>
            </ScrollableContentContainer>

            <RightOfScrollableContent>
              {this.renderItemId(number, 'git-pull-request')}
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
            <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
              <Comment numberOfLines={1}>{_message}</Comment>
            </ScrollableContentContainer>

            <RightOfScrollableContent>
              {this.renderItemId(null, 'git-commit')}
            </RightOfScrollableContent>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  this.renderIssueRow = ({ actor, issue: { user, number, title } = {} } = {}) => {
    let _title = (title || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_title) return null;

    return (
      <ContentRow narrow>
        <LeftColumn center>{this.renderUserAvatar(user || actor, avatarWidth / 2)}</LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <ScrollableContentContainer alwaysBounceHorizontal={false} horizontal>
              <Comment numberOfLines={1}>{_title}</Comment>
            </ScrollableContentContainer>

            <RightOfScrollableContent>
              {this.renderItemId(number, 'issue-opened')}
            </RightOfScrollableContent>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  this.renderRepositoryRow = ({ name } = {}, { ref }) => {
    const orgName = (name || '').split('/')[0];
    const repoName = orgName ? (name || '').split('/')[1] : name;

    if (!repoName) return null;

    return (
      <ContentRow>
        <LeftColumn center />

        <MainColumn>
          <HighlightContainerRow1>
            <RepositoryContentContainer alwaysBounceHorizontal={false} horizontal>
              { orgName && <OrganizationName>{orgName}/</OrganizationName>}
              <RepositoryName>{repoName}</RepositoryName>
            </RepositoryContentContainer>

            <RepositoryStarButton>
              <RepositoryStarIcon name="star"/>
            </RepositoryStarButton>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  };

  this.renderCommentRow = ({
    comment: { body } = {},
    issue: { number } = {}
  } = {}) => {
    let _body = (body || '').replace(/\r\n/g, ' ').replace('  ', ' ').trim();
    if (!_body) return null;

    return (
      <ContentRow>
        <LeftColumn>{this.renderUserAvatar(actor, avatarWidth / 2)}</LeftColumn>

        <MainColumnRowContent>
          <Comment numberOfLines={2}>{_body}</Comment>
        </MainColumnRowContent>
      </ContentRow>
    );
  };

  const dateText = getDateSmallText(created_at);

  return (
    <Card {...props}>
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

      {this.renderRepositoryRow(repo, payload)}

      {this.renderPullRequestRow(payload)}

      {this.renderCommitRow(payload)}

      {this.renderIssueRow(payload)}

      {this.renderCommentRow(payload)}
    </Card>
  );
}
