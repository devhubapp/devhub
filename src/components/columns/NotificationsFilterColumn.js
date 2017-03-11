// @flow

import React from 'react';
import styled from 'styled-components/native';
import { memoize } from 'lodash';
import { List } from 'immutable';

import ColumnWithList, { headerFontSize } from './_ColumnWithList';
import Icon from '../../libs/icon';
import { ImmutableSectionList } from '../../libs/immutable-virtualized-list';
import { FullView, StyledText } from '../cards/__CardComponents';
import { contentPadding } from '../../styles/variables';
import { getParamsToLoadAllNotifications } from '../../sagas/notifications';
import { get, updateIn } from '../../utils/immutable';
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

const totalItemNotifications = item => (
  item ? (get(item, 'read') || 0) + (get(item, 'unread') || 0) : 0
);

const willShowItem = item => (
  item && (get(item, 'pinned') || totalItemNotifications(item))
);

const isSectionEmpty = section => (
  !section || !get(section, 'data') || !get(section, 'data').some(willShowItem)
);

const sectionHeaderHasChanged = (prevSectionData, nextSectionData) => (
  prevSectionData !== nextSectionData
);

const renderItem = ({ index, item }: { index: number, item: Object }) => {
  if (!willShowItem(item)) {
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
              {totalItemNotifications(item)}
            </TotalCount>
          )
        }
      </CounterWrapper>
    </ItemWrapper>
  );
};

const cleanupData = memoize(sections =>
  (sections || List())
    .map(section => updateIn(section, ['data'], data => data.filter(willShowItem)))
    .filterNot(isSectionEmpty));

const getStateForItems = items => ({
  firstSectionKey: (cleanupData(items).first() || List()).get('key'),
  data: cleanupData(items),
});

export default class extends React.PureComponent {
  static defaultProps = {
    icon: defaultIcon,
    onRefresh: this.onRefresh,
    radius: undefined,
    style: undefined,
    title: defaultTitle,
  };

  state = getStateForItems(this.props.items);

  componentWillReceiveProps(newProps) {
    if (newProps.items !== this.props.items) {
      this.setState(getStateForItems(newProps.items));
    }
  }

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

  renderSectionHeader = ({ section }) =>
    !!section &&
    !(get(section, 'key') === this.state.firstSectionKey ||
      isSectionEmpty(section)) &&
      <Section />;

  render() {
    const { data } = this.state;
    const { onRefresh, style, ...props } = this.props;

    return (
      <FullView style={style}>
        <ColumnWithList
          {...props}
          ListComponent={ImmutableSectionList}
          key="notification-filter-_ColumnWithList"
          initialNumToRender={20}
          isEmpty={false}
          items={data}
          onRefresh={onRefresh}
          renderItem={renderItem}
          renderSectionHeader={this.renderSectionHeader}
          sectionHeaderHasChanged={sectionHeaderHasChanged}
          sections={data}
        />
      </FullView>
    );
  }
}
