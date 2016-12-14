// @flow

import React from 'react';
import { ScrollView } from 'react-native';

import WikiPageRow from './_WikiPageRow';
import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';

import { contentPadding, radius } from '../../styles/variables';
import type { ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    narrow?: boolean,
    pages: Array<Object>,
    theme?: ThemeObject,
  };

  render() {
    const { pages, narrow, theme, ...props } = this.props;

    if (!(pages && pages.size > 0)) return null;

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
          style={{ maxHeight: 120 }}
          contentContainerStyle={{ paddingBottom: contentPadding }}
          alwaysBounceVertical={false}
        >
          {
            pages.map((page) => (
              <WikiPageRow
                key={`wiki-page-row-${page.get('sha')}`}
                title={page.get('title')}
                narrow={narrow}
              />
            ))
          }
        </ScrollView>
      </TransparentTextOverlay>
    );
  }
}
