// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';

import {
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
  Text,
} from './';

import { contentPadding, radius } from '../../styles/variables';
import type { ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    narrow?: boolean,
    title: string,
    theme?: ThemeObject,
  };

  render() {
    const { title, narrow, theme } = this.props;

    if (!title) return null;

    return (
      <ContentRow narrow={narrow}>
        <LeftColumn />

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
                  <Text numberOfLines={1}>
                    <Icon name="book" />&nbsp;
                    {title}
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
