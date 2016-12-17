// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';
import UserAvatar from './_UserAvatar';

import {
  avatarWidth,
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
  Text,
} from './';

import { contentPadding, radius } from '../../styles/variables';
import { trimNewLines } from '../../utils/helpers';
import type { User, ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    user: User,
    additionalInfo?: ?string,
    narrow?: boolean,
    theme?: ThemeObject,
  };

  render() {
    const { additionalInfo, narrow, user, theme } = this.props;

    if (!user) return null;

    const _login = trimNewLines(user.get('login'));
    if (!_login) return null;

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn center>
          <UserAvatar url={user.get('avatar_url')} size={avatarWidth / 2} />
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
                  <Text numberOfLines={1}>
                    <Icon name="person" />&nbsp;
                    {_login}
                    {additionalInfo && <Text muted> {additionalInfo}</Text>}
                  </Text>
                </RepositoryContentContainer>
              </TransparentTextOverlay>
            </FullView>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  }
}
