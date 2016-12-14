// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';
import UserAvatar from './_UserAvatar';

import {
  avatarWidth,
  renderItemId,
  CardText,
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
  RightOfScrollableContent,
} from './';

import { contentPadding, radius } from '../../styles/variables';
import { trimNewLines } from '../../utils/helpers';
import type { ThemeObject } from '../../utils/types';
import type { Issue } from '../../utils/types/github';

@Themable
export default class extends React.PureComponent {
  props: {
    issue: Issue,
    narrow?: boolean,
    theme?: ThemeObject,
  };

  render() {
    const { issue, narrow, theme } = this.props;

    if (!issue) return null;

    const { user, number, state, title } = {
      user: issue.get('user'),
      number: issue.get('number'),
      state: issue.get('state'),
      title: issue.get('title'),
    };

    const _title = trimNewLines(title);
    if (!_title) return null;

    const { icon, color } = (() => {
      switch (state) {
        case 'closed':
          return { icon: 'issue-closed', color: theme.red };
        default:
          return { icon: 'issue-opened', color: theme.green };
      }
    })();

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn center>
          {
            user &&
            <UserAvatar url={user.get('avatar_url')} size={avatarWidth / 2} />
          }
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <FullView>
              <TransparentTextOverlay
                color={theme.base01}
                size={contentPadding}
                from="right"
                radius={radius}
              >
                <RepositoryContentContainer>
                  <CardText numberOfLines={1}>
                    <Icon name={icon} color={color} />&nbsp;
                    {_title}
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
