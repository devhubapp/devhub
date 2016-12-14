// @flow

import React from 'react';
import { ScrollView } from 'react-native';

import CommitRow from './_CommitRow';
import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';

import { contentPadding, radius } from '../../styles/variables';
import type { Commit, ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    commits: Array<Commit>,
    narrow?: boolean,
    theme?: ThemeObject,
  };

  render() {
    const { commits, narrow, theme, ...props } = this.props;

    if (!(commits && commits.size > 0)) return null;

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
            commits.map(commit => (
              <CommitRow
                key={`commit-row-${commit.get('sha')}`}
                commit={commit}
                narrow={narrow}
              />
            ))
          }
        </ScrollView>
      </TransparentTextOverlay>
    );
  }
}
