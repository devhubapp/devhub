// @flow

import React from 'react';
import { withTheme } from 'styled-components/native';

import ScrollableButton from '../buttons/ScrollableButton';
import TransparentTextOverlay from '../TransparentTextOverlay';
import { openOnGithub } from '../../utils/helpers/github/url';
import { withNavigation } from '../../libs/navigation';

import {
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
} from './__CardComponents';

import { contentPadding, radius } from '../../styles/variables';
import type { ThemeObject } from '../../utils/types';

@withNavigation
@withTheme
export default class extends React.PureComponent {
  props: {
    children: React.Element,
    left?: React.Element,
    narrow?: boolean,
    navigation: Object,
    onPress?: Function,
    pushed?: boolean,
    read?: boolean,
    right?: React.Element,
    theme?: ThemeObject,
    url?: string,
  };

  render() {
    const {
      children,
      left,
      narrow,
      navigation,
      onPress,
      read,
      right,
      theme,
      url,
      ...props
    } = this.props;

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn muted={read} center>
          {left}
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
                <ScrollableButton
                  onPress={onPress || (url ? (() => openOnGithub(navigation, url)) : null)}
                  horizontal
                >
                  {children}
                </ScrollableButton>
              </TransparentTextOverlay>
            </FullView>

            {right}
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  }
}
