// @flow

import React from 'react';
import { ScrollView } from 'react-native';

import { withTheme } from 'styled-components/native';
import TransparentTextOverlay from '../TransparentTextOverlay';

import { contentPadding, radius } from '../../styles/variables';
import type { ThemeObject } from '../../utils/types';

@withTheme
export default class extends React.PureComponent {
  props: {
    data: Array<any>,
    maxHeight?: number,
    narrow?: boolean,
    renderRow: Function,
    theme?: ThemeObject,
  };

  render() {
    const { data, maxHeight = 200, narrow, renderRow, theme, ...props } = this.props;

    if (!(data && data.size > 0)) return null;

    return (
      <TransparentTextOverlay
        {...props}
        color={theme.base02}
        size={narrow ? contentPadding / 2 : contentPadding}
        from="vertical"
        radius={radius}
        containerStyle={{ flex: 0 }}
      >
        <ScrollView
          style={{ maxHeight }}
          contentContainerStyle={{
            marginTop: narrow ? -contentPadding / 2 : -contentPadding,
            paddingVertical: narrow ? contentPadding / 2 : contentPadding,
          }}
          alwaysBounceVertical={false}
        >
          {data.map(renderRow)}
        </ScrollView>
      </TransparentTextOverlay>
    );
  }
}
