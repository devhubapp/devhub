// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import { withTheme } from 'styled-components/native';
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
import { trimNewLinesAndSpaces } from '../../utils/helpers';
import type { ThemeObject } from '../../utils/types';

@withTheme
export default class extends React.PureComponent {
  props: {
    narrow?: boolean,
    title: string,
    theme?: ThemeObject,
  };

  render() {
    const { narrow, page, theme, ...props } = this.props;

    if (!page) return null;

    const title = trimNewLinesAndSpaces(page.get('title') || page.get('page_name'));
    if (!title) return null;

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn />

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
