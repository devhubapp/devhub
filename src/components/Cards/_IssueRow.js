// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import { withTheme } from 'styled-components/native';
import TransparentTextOverlay from '../TransparentTextOverlay';
import UserAvatar from './_UserAvatar';

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
  Text,
} from './__CardComponents';

import { contentPadding, radius } from '../../styles/variables';
import { getIssueIconAndColor, trimNewLinesAndSpaces } from '../../utils/helpers';
import type { Issue, ThemeObject } from '../../utils/types';

@withTheme
export default class extends React.PureComponent {
  props: {
    issue: Issue,
    narrow?: boolean,
    theme?: ThemeObject,
  };

  render() {
    const { issue, narrow, theme, ...props } = this.props;

    if (!issue) return null;

    const user = issue.get('user');
    const number = issue.get('number');
    const title = issue.get('title');

    const _title = trimNewLinesAndSpaces(title);
    if (!_title) return null;

    const { icon, color } = getIssueIconAndColor(issue, theme);

    const byText = user && user.get('login') ? `@${user.get('login')}` : '';

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn center>
          {
            user &&
            <UserAvatar url={user.get('avatar_url')} size={smallAvatarWidth} />
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
                    {_title}
                    {byText && <Text muted small> by {byText}</Text>}
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
