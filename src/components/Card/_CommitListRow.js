// @flow

import React from 'react';
import { ScrollView } from 'react-native';

import CommitRow from './_CommitRow';
import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';

import { FullView } from './';
import { contentPadding, radius } from '../../styles/variables';
import type { Commit, ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    commits: Array<Commit>,
    theme?: ThemeObject,
  };

  render() {
    const { commits, theme } = this.props;

    if (!(commits && commits.size > 0)) return null;

    return (
      <FullView>
        <TransparentTextOverlay
          color={theme.base02}
          size={contentPadding}
          from="bottom"
          radius={radius}
        >
          <ScrollView
            style={{ maxHeight: 120 }}
            contentContainerStyle={{ flex: 1, paddingBottom: contentPadding }}
            alwaysBounceVertical={false}
          >
            {
              commits.map(commit => (
                <CommitRow
                  key={`commit-row-${commit.get('sha')}`}
                  commit={commit}
                  narrow
                />
              ))
            }
          </ScrollView>
        </TransparentTextOverlay>
      </FullView>
    );
  }
}
