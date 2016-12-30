// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import { withTheme } from 'styled-components/native';
import TransparentTextOverlay from '../TransparentTextOverlay';
import OwnerAvatar from './_OwnerAvatar';

import {
  renderItemId,
  CardText,
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
  RightOfScrollableContent,
  smallAvatarWidth,
  StyledText,
} from './__CardComponents';

import { contentPadding, radius } from '../../styles/variables';
import { getPullRequestIconAndColor, trimNewLinesAndSpaces } from '../../utils/helpers';
import type { PullRequest, ThemeObject } from '../../utils/types';

@withTheme
export default class extends React.PureComponent {
  props: {
    narrow: boolean,
    pullRequest: PullRequest,
    theme?: ThemeObject,
  };

  render() {
    const { narrow, pullRequest, theme, ...props } = this.props;

    if (!pullRequest) return null;

    const title = trimNewLinesAndSpaces(pullRequest.get('title'));
    if (!title) return null;

    const number = pullRequest.get('number');
    const user = pullRequest.get('user');

    const { icon, color } = getPullRequestIconAndColor(pullRequest, theme);

    const byText = user && user.get('login') ? `@${user.get('login')}` : '';

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn center>
          {
            user &&
            <OwnerAvatar url={user.get('avatar_url')} size={smallAvatarWidth} />
          }
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <FullView>
              <TransparentTextOverlay
                color={theme.base01}
                size={contentPadding}
                from="horizontal"
                radius={radius}
              >
                <RepositoryContentContainer>
                  <CardText numberOfLines={1}>
                    <Icon name={icon} color={color} />&nbsp;
                    {title}
                    {byText && <StyledText muted small> by {byText}</StyledText>}
                  </CardText>
                </RepositoryContentContainer>
              </TransparentTextOverlay>
            </FullView>

            <RightOfScrollableContent>
              {renderItemId(number)}
            </RightOfScrollableContent>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  }
}
