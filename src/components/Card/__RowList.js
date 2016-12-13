// @flow

import React from 'react';
import { ScrollView } from 'react-native';

import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';

import { contentPadding, radius } from '../../styles/variables';
import type { ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    data: Array<any>,
    maxHeight?: number,
    renderRow: Function,
    theme?: ThemeObject,
  };

  render() {
    const { data, maxHeight = 120, renderRow, theme, ...props } = this.props;

    if (!(data && data.size > 0)) return null;

    return (
      <TransparentTextOverlay
        {...props}
        color={theme.base02}
        size={contentPadding}
        from="bottom"
        radius={radius}
        containerStyle={{ flex: 0, marginBottom: -contentPadding }}
      >
        <ScrollView
          style={{ maxHeight }}
          contentContainerStyle={{ paddingBottom: contentPadding }}
          alwaysBounceVertical={false}
        >
          {data.map(renderRow)}
        </ScrollView>
      </TransparentTextOverlay>
    );
  }
}
