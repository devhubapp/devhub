// @flow

import React from 'react';
import { ScrollView } from 'react-native';

import WikiPageRow from './_WikiPageRow';
import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';

import { contentPadding } from '../../styles/variables';
import type { ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    pages: Array<Object>,
    theme?: ThemeObject,
  };

  render() {
    const { pages, theme } = this.props;

    if (!(pages && pages.size > 0)) return null;

    return (
      <TransparentTextOverlay color={theme.base02} size={contentPadding} from="bottom">
        <ScrollView
          style={{ maxHeight: 120 }}
          contentContainerStyle={{ flex: 1, paddingBottom: contentPadding }}
          alwaysBounceVertical={false}
        >
          {
            pages.map((page) => (
              <WikiPageRow
                key={`wiki-page-row-${page.get('sha')}`}
                title={page.get('title')}
                narrow
              />
            ))
          }
        </ScrollView>
      </TransparentTextOverlay>
    );
  }
}
