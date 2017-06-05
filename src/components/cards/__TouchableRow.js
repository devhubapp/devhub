// @flow

import React from 'react'
import { withTheme } from 'styled-components/native'

import ScrollableButton from '../buttons/ScrollableButton'
import TransparentTextOverlay from '../TransparentTextOverlay'
import { openOnGithub } from '../../utils/helpers/github/url'

import {
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
} from './__CardComponents'

import { contentPadding, radius } from '../../styles/variables'
import type { ThemeObject } from '../../utils/types'

@withTheme
export default class TouchableRow extends React.PureComponent {
  props: {
    children: ReactClass<any>,
    left?: ReactClass<any>,
    narrow?: boolean,
    onPress?: Function,
    pushed?: boolean,
    read?: boolean,
    right?: ReactClass<any>,
    theme?: ThemeObject,
    url?: string,
  }

  render() {
    const {
      children,
      left,
      narrow,
      onPress,
      read,
      right,
      theme,
      url,
      ...props
    } = this.props

    return (
      <ContentRow narrow={narrow} {...props}>
        <LeftColumn muted={read} center>
          {left}
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1 outline>
            <FullView>
              <TransparentTextOverlay
                color={theme.base02}
                size={contentPadding}
                from="horizontal"
                radius={radius}
              >
                <ScrollableButton
                  onPress={onPress || (url ? () => openOnGithub(url) : null)}
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
    )
  }
}
