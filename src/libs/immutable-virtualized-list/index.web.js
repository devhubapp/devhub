/* @flow */

import React from 'react';
import ImmutableListView from 'react-native-immutable-list-view';
import { OrderedMap } from 'immutable';
import type { List } from 'immutable';

import { get } from '../../utils/immutable';

const makeRenderRow = (immutableData, renderItem) => item =>
  !!immutableData && renderItem({ item });

type Props = {
  immutableData: List,
  renderItem: ({ item: any, index: number }) => ?React.Element<any>,
};

export default ({ immutableData, renderItem, ...props }: Props) => (
  <ImmutableListView
    immutableData={immutableData}
    renderRow={makeRenderRow(immutableData, renderItem)}
    {...props}
  />
);

const makeRenderSectionHeader = renderSectionHeader => (section, key) =>
  renderSectionHeader({
    section: OrderedMap({ key, data: section.toList() }),
  });

type Section = { key: string, data: List };

type SectionListProps = Props & {
  renderSectionHeader: ({ section: Section }) => ?React.Element<any>,
  sections: List<Section>,
};
export const ImmutableSectionList = ({
  immutableData,
  renderItem,
  renderSectionHeader,
  sections,
  ...props
}: SectionListProps) => (
  <ImmutableListView
    immutableData={immutableData || sections}
    renderRow={makeRenderRow(immutableData, renderItem)}
    renderSectionHeader={makeRenderSectionHeader(renderSectionHeader)}
    {...props}
  />
);
