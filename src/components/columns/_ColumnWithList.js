// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import ImmutableListView from 'react-native-immutable-list-view';
import { Map } from 'immutable';
import { RefreshControl } from 'react-native';

import ColumnWithHeader, { getRadius } from './_ColumnWithHeader';
import TransparentTextOverlay from '../TransparentTextOverlay';
import { EmptyColumnContent } from './EmptyColumn';
import { contentPadding } from '../../styles/variables';
import { getDateWithHourAndMinuteText } from '../../utils/helpers';
import type { Subscription, ThemeObject } from '../../utils/types';

export * from './_ColumnWithHeader';

export const StyledTextOverlay = styled(TransparentTextOverlay) `
  flex: 1;
  border-radius: ${({ radius }) => radius || 0};
`;

export const StyledImmutableListView = styled(ImmutableListView)`
  flex: 1;
  overflow: hidden;
`;

@withTheme
export default class extends React.PureComponent {
  state = {
    hasLoadedOnce: false,
  };

  componentWillReceiveProps({ loading }) {
    // if finished loading
    if (!loading && this.props.loading) {
      if (this.state.hasLoadedOnce === false) {
        this.setState({ hasLoadedOnce: true });
      }
    }
  }

  props: {
    errors?: ?Array<string>,
    rightHeader?: React.Element,
    icon: string,
    initialListSize?: number,
    isEmpty?: boolean,
    items: Array<Object>,
    loading?: boolean,
    radius?: number,
    onRefresh?: Function,
    refreshText?: string,
    renderRow: Function,
    renderSectionHeader?: Function,
    style?: ?Object,
    readIds: Array<string>,
    sectionHeaderHasChanged?: Function,
    subscriptions: Array<Subscription>,
    theme: ThemeObject,
    title: string,
    updatedAt?: Date,
    width?: number,
  };

  render() {
    const { hasLoadedOnce } = this.state;
    const {
      initialListSize,
      isEmpty,
      items: _items,
      loading,
      onRefresh,
      refreshText: _refreshText,
      renderRow,
      renderSectionHeader,
      sectionHeaderHasChanged,
      theme,
      updatedAt,
      ...props
    } = this.props;

    const items = _items || Map();
    const _radius = getRadius(props);

    let refreshText = _refreshText;
    if (!refreshText && updatedAt) {
      const dateFromNowText = getDateWithHourAndMinuteText(updatedAt);
      refreshText = dateFromNowText ? `Updated ${dateFromNowText}` : '';
    }

    const refreshControl = (
      (onRefresh || refreshText) &&
      <RefreshControl
        refreshing={false}
        onRefresh={onRefresh}
        colors={[loading || !onRefresh ? 'transparent' : theme.base07]}
        tintColor={loading || !onRefresh ? 'transparent' : theme.base07}
        title={(refreshText || ' ').toLowerCase()}
        titleColor={theme.base05}
        progressBackgroundColor={theme.base02}
      />
    );

    return (
      <ColumnWithHeader {...this.props}>
        <StyledTextOverlay color={theme.base02} size={contentPadding} from="vertical" radius={_radius}>
          {
            isEmpty || !(items.size > 0)
              ? (
                hasLoadedOnce
                  ? <EmptyColumnContent refreshControl={refreshControl} />
                  : null
              )
              : (
                <StyledImmutableListView
                  immutableData={items}
                  initialListSize={initialListSize || 5}
                  rowsDuringInteraction={initialListSize || 5}
                  renderRow={renderRow}
                  renderSectionHeader={renderSectionHeader}
                  refreshControl={refreshControl}
                  sectionHeaderHasChanged={sectionHeaderHasChanged}
                  contentContainerStyle={{ overflow: 'hidden' }}
                  removeClippedSubviews
                />
              )
          }
        </StyledTextOverlay>
      </ColumnWithHeader>
    );
  }
}
