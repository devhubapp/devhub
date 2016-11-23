// @flow

import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';

import Avatar from './Avatar';
import { contentPadding } from '../styles/variables';

const avatarWidth = 36;

const Card = styled.View`
  padding-horizontal: ${contentPadding};
  padding-vertical: ${contentPadding * 1.4};
  border-width: 0;
  border-bottom-width: 0.5;
  border-color: ${({ theme }) => theme.base01};
`;

const HorizontalView = styled.View`
  flex-direction: row;
`;

const Header = styled(HorizontalView)`
  align-items: center;
`;

const LeftColumn = styled.View`
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
  line-height: 30;
`;

const RepositoryName = styled(Text)`
  line-height: 30;
  font-weight: bold;
`;

const CardItemId = styled(Text)`
  font-weight: bold;
  font-size: 12;
  opacity: 0.9;
`;

const Comment = styled(Text)`
  flex: 1;
  opacity: 0.9;
`;

const ContentRow = styled(HorizontalView)`
  align-items: center;
  margin-top: ${contentPadding};
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

const RepositoryContainer = styled(HighlightContainer1)`
  padding-horizontal: ${contentPadding};
`;

const CardIdContainer = styled(HighlightContainer2)`
  padding-horizontal: 6;
`;

const StarIcon = styled(Icon)`
  font-size: 16;
  color: ${({ theme }) => theme.star};
`;

const CardIcon = styled(Icon)`
  align-self: center;
  margin-right: ${contentPadding - 2};
  font-size: 20;
  color: ${({ theme }) => theme.base04};
  opacity: 0.4;
`;

type Props = {
};

export default ({ ...props }: Props) => (
  <Card {...props}>
    <Header>
      <LeftColumn>
        <Avatar
          size={avatarWidth}
          source={{ uri: 'https://avatars0.githubusercontent.com/u/619186?v=3&s=100' }}
        />
      </LeftColumn>

      <MainColumn>
        <HeaderRow>
          <View>
            <HorizontalView>
              <Username>brunolemos</Username>
              <Timestamp> • 34m</Timestamp>
            </HorizontalView>

            <MutedText>commented on pull request</MutedText>
          </View>

          <CardIcon name="comment-discussion" />
        </HeaderRow>
      </MainColumn>
    </Header>

    <ContentRow>
      <LeftColumn />

      <MainColumn>
        <RepositoryContainer>
          <HorizontalView>
            <OrganizationName>react/</OrganizationName>
            <RepositoryName>react</RepositoryName>
          </HorizontalView>

          <StarIcon name="star" />
        </RepositoryContainer>
      </MainColumn>
    </ContentRow>

    <ContentRow>
      <LeftColumn>
        <Avatar
          size={avatarWidth / 2}
          source={{ uri: 'https://avatars0.githubusercontent.com/u/619186?v=3&s=100' }}
        />
      </LeftColumn>

      <MainColumnRowContent>
        <CardIdContainer>
          <CardItemId>#5030</CardItemId>
        </CardIdContainer>

        <Comment numberOfLines={1}>&nbsp;Hi there, it would be nice to have this feature</Comment>
      </MainColumnRowContent>
    </ContentRow>
  </Card>
);
