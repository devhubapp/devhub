// @flow

import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Octicons';

import ColumnWithList, { headerFontSize } from './_ColumnWithList';
import { FullView, StyledText } from '../cards/__CardComponents';
import { contentPadding } from '../../styles/variables';
import { getParamsToLoadAllNotifications } from '../../sagas/notifications';
import { get } from '../../utils/immutable';
import type { ActionCreators } from '../../utils/types';


export const Section = styled.View`
  height: 1;
  background-color: ${({ theme }) => theme.base01};
`;

export const ItemWrapper = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${contentPadding};
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
  margin-top: 2;
  margin-right: 6;
  font-size: ${headerFontSize};
  color: ${({ color, theme }) => color || theme.base04};
`;

const CounterWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: ${contentPadding};
  padding-horizontal: ${contentPadding};
  padding-vertical: 1;
  border-radius: 10;
  background-color: ${({ outline, theme }) => (outline ? 'transparent' : theme.base03)};
  border-width: 1;
  border-color: ${({ theme }) => theme.base03};
`;

const UnreadCount = styled(StyledText)`
  font-size: 12;
  color: ${({ count, theme }) => (count > 0 ? theme.base04 : theme.base05)};
  text-align: center;
`;

const TotalCount = styled(StyledText)`
  font-size: 12;
  color: ${({ theme }) => theme.base05};
`;

export default class extends React.PureComponent {
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
    radius?: number,
    style?: Object,
    title?: string,
    theme?: Object,
  };

  totalItemNotifications = (item) => (
    item
      ? (get(item, 'read') || 0) + (get(item, 'unread') || 0)
      : 0
  );

  willShowItem = (item) => (
    item && (get(item, 'pinned') || this.totalItemNotifications(item))
  );

  isSectionEmpty = (sectionData) => (
    !sectionData || !sectionData.some(this.willShowItem)
  );

  sectionHeaderHasChanged = (prevSectionData, nextSectionData) => (
    prevSectionData !== nextSectionData
  );

  makeRenderSectionHeader = (firstSectionId) => (sectionData, sectionId) => (
    sectionData && sectionData.size > 0 &&
    !(sectionId === firstSectionId || this.isSectionEmpty(sectionData)) &&
    <Section />
  );

  renderRow = (item, sectionId, rowId) => {
    if (!this.willShowItem(item)) {
      return null;
    }

    return (
      <ItemWrapper key={`notifications-filter-column-item-${sectionId}-${rowId}`}>
        <ItemTitleWrapper>
          <ItemIcon name={get(item, 'icon')} color={get(item, 'color')} />
          <ItemTitle numberOfLines={1}>{get(item, 'title') || rowId}</ItemTitle>
        </ItemTitleWrapper>

        <CounterWrapper outline={!(get(item, 'unread') > 0)}>
          {
            get(item, 'unread') >= 0 &&
            <UnreadCount count={get(item, 'unread')}>{get(item, 'unread')}</UnreadCount>
          }
          {
            get(item, 'read') >= 0 &&
            <TotalCount>
              {get(item, 'unread') >= 0 && ' / '}
              {this.totalItemNotifications(item)}
            </TotalCount>
          }
        </CounterWrapper>
      </ItemWrapper>
    );
  };

  render() {
    const { column,
      icon = 'zap',
      items,
      style,
      title = 'summary',
      ...props
    } = this.props;

    if (!column) return null;

    return (
      <FullView style={style}>
        <ColumnWithList
          key="notification-filter-_ColumnWithList"
          icon={icon}
          title={title}
          initialListSize={20}
          items={items}
          refreshFn={this.onRefresh}
          renderRow={this.renderRow}
          renderSectionHeader={this.makeRenderSectionHeader(items.keySeq().first())}
          sectionHeaderHasChanged={this.sectionHeaderHasChanged}
          {...props}
        />
      </FullView>
    );
  }
}
