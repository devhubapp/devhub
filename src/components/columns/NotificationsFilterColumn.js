// @flow

import React from 'react';
import styled from 'styled-components/native';
import { List } from 'immutable';

import ColumnWithList, { headerFontSize } from './_ColumnWithList';
import Icon from '../../libs/icon';
import { ImmutableSectionList } from '../../libs/immutable-virtualized-list';
import { FullView, StyledText } from '../cards/__CardComponents';
import { contentPadding } from '../../styles/variables';
import { getParamsToLoadAllNotifications } from '../../sagas/notifications';
import { get } from '../../utils/immutable';
import type { ActionCreators } from '../../utils/types';

export const defaultIcon = 'zap';
export const defaultTitle = 'summary';

export const Section = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.base01};
`;

export const ItemWrapper = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${contentPadding}px;
`;

export const ItemTitleWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ItemTitle = styled(StyledText)`
  flex: 1;
`;

const ItemIcon = styled(Icon)`
  margin-top: 2px;
  margin-right: 6px;
  font-size: ${headerFontSize}px;
  color: ${({ color, theme }) => color || theme.base04};
`;

const CounterWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: ${contentPadding}px;
  padding-horizontal: ${contentPadding}px;
  padding-vertical: 0.5;
  border-radius: 10px;
  background-color: ${({ outline, theme }) => (
    outline ? 'transparent' : theme.base01
  )};
  border-width: 1px;
  border-color: ${({ outline, theme }) => (outline ? theme.base03 : theme.base01)};
`;

const UnreadCount = styled(StyledText)`
  font-size: 12px;
  color: ${({ count, theme }) => (count > 0 ? theme.base04 : theme.base05)};
  text-align: center;
`;

const TotalCount = styled(StyledText)`
  font-size: 12px;
  color: ${({ theme }) => theme.base05};
`;

export default class extends React.PureComponent {
  static defaultProps = {
    icon: defaultIcon,
    onRefresh: this.onRefresh,
    radius: undefined,
    style: undefined,
    title: defaultTitle,
  };

  onRefresh = () => {
    const { actions: { updateNotifications } } = this.props;

    const params = getParamsToLoadAllNotifications();
    updateNotifications(params);
  };

  props: {
    actions: ActionCreators,
    column: Object,
    icon?: string,
    items: Object,
    onRefresh?: Function,
    radius?: number,
    style?: Object,
    title?: string,
  };

  totalItemNotifications = item => (
    item ? (get(item, 'read') || 0) + (get(item, 'unread') || 0) : 0
  );

  willShowItem = item => (
    item && (get(item, 'pinned') || this.totalItemNotifications(item))
  );

  isSectionEmpty = section => (
    !section || !get(section, 'data') || !get(section, 'data').some(this.willShowItem)
  );

  sectionHeaderHasChanged = (prevSectionData, nextSectionData) => (
    prevSectionData !== nextSectionData
  );

  // TODO: Mode firstSectionKey to component state
  makeRenderSectionHeader = firstSectionKey =>
  ({ section }) =>
    !!section &&
      !(get(section, 'key') === firstSectionKey ||
        this.isSectionEmpty(section)) &&
        <Section />;

  renderItem = ({ index, item }) => {
    if (!this.willShowItem(item)) {
      return null;
    }

    return (
      <ItemWrapper
        key={`notifications-filter-column-item-${get(item, 'key') || index}`}
      >
        <ItemTitleWrapper>
          <ItemIcon name={get(item, 'icon')} color={get(item, 'color')} />
          <ItemTitle numberOfLines={1}>{get(item, 'title') || get(item, 'key')}</ItemTitle>
        </ItemTitleWrapper>
        <CounterWrapper outline={!(get(item, 'unread') > 0)}>
          {
            get(item, 'unread') >= 0 && (
              <UnreadCount count={get(item, 'unread')}>
                {get(item, 'unread')}
              </UnreadCount>
            )
          }
          {
            get(item, 'read') >= 0 && (
              <TotalCount>
                {get(item, 'unread') >= 0 && ' / '}
                {this.totalItemNotifications(item)}
              </TotalCount>
            )
          }
        </CounterWrapper>
      </ItemWrapper>
    );
  };

  render() {
    const {
      items: _items,
      onRefresh,
      style,
      ...props
    } = this.props;

    const items = _items || List();

    return (
      <FullView style={style}>
        <ColumnWithList
          {...props}
          ListComponent={ImmutableSectionList}
          key="notification-filter-_ColumnWithList"
          initialListSize={20}
          isEmpty={false}
          items={items}
          onRefresh={onRefresh}
          renderItem={this.renderItem}
          renderSectionHeader={
            this.makeRenderSectionHeader(items.first().get('key'))
          }
          sectionHeaderHasChanged={this.sectionHeaderHasChanged}
          sections={items}
        />
      </FullView>
    );
  }
}
