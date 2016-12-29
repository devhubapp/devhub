// @flow

import ActionSheet from 'react-native-actionsheet';
import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';

import {
  makeColumnEventIdsSelector,
  makeColumnSeenIdsSelector,
} from '../../selectors';

import Column, { HeaderButton, HeaderButtonText, HeaderButtonsContainer } from './_Column';
import EventCardContainer from '../../containers/EventCardContainer';
import CreateColumnUtils from '../utils/CreateColumnUtils';
import { getRequestTypeIcon, requestTypes } from '../../api/github';
import { getDateWithHourAndMinuteText } from '../../utils/helpers';
import type { ActionCreators, Column as ColumnType, Subscription } from '../../utils/types';

const Root = styled.View`
  flex: 1;
`;

const buttons = ['Create new column', 'Mark all as seen / unseen', 'Clear seen', 'Delete column', 'Cancel'];
const BUTTONS = {
  CREATE_NEW_COLUMN: 0,
  MARK_EVENTS_AS_SEEN_OR_UNSEEN: 1,
  CLEAR_SEEN: 2,
  DELETE_COLUMN: 3,
  CANCEL: 4,
};

export default class extends React.PureComponent {
  static contextTypes = {
    store: React.PropTypes.object.isRequired,
  };

  onRefresh = () => {
    const { column, actions: { updateColumnSubscriptions } } = this.props;
    updateColumnSubscriptions(column.get('id'));
  };

  getEventIdsAndSeenIds = () => {
    const { column } = this.props;

    const columnId = column.get('id');

    const store = this.context.store;
    const state = store.getState();

    this.columnEventIdsSelector = this.columnEventIdsSelector || makeColumnEventIdsSelector();
    this.columnSeenIdsSelector = this.columnSeenIdsSelector || makeColumnSeenIdsSelector();

    return {
      eventIds: this.columnEventIdsSelector(state, { columnId }),
      seenIds: this.columnSeenIdsSelector(state, { columnId }),
    };
  }

  hasOnlyOneRepository = () => {
    const { subscriptions } = this.props;

    return subscriptions.size === 1 &&
      subscriptions.first().get('requestType') === requestTypes.REPO_EVENTS
    ;
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  handleActionSheetButtonPress = (index) => {
    const { actions, column } = this.props;

    const columnId = column.get('id');

    switch (index) {
      case BUTTONS.CREATE_NEW_COLUMN:
        CreateColumnUtils.showColumnTypeSelectAlert(actions);
        break;

      case BUTTONS.MARK_EVENTS_AS_SEEN_OR_UNSEEN:
        (() => {
          const { eventIds, seenIds } = this.getEventIdsAndSeenIds();

          if (seenIds && seenIds.size >= eventIds.size) {
            actions.markEventsAsUnseen({ columnId, eventIds });
          } else {
            actions.markEventsAsSeen({ columnId, eventIds });
          }
        })();

        break;

      case BUTTONS.CLEAR_SEEN:
        (() => {
          const { seenIds } = this.getEventIdsAndSeenIds();
          actions.clearEvents({ columnId, eventIds: seenIds });
        })();
        break;

      case BUTTONS.DELETE_COLUMN:
        actions.deleteColumn(columnId);
        break;

      default:
        break;
    }
  };

  props: {
    actions: ActionCreators,
    column: ColumnType,
    errors?: ?Array<string>,
    items: Array<Object>,
    loading?: boolean,
    radius?: number,
    style?: ?Object,
    seenIds: Array<string>,
    subscriptions: Array<Subscription>,
  };

  renderRow = (event) => (
    <EventCardContainer
      key={`event-card-${event.get('id')}`}
      actions={this.props.actions}
      eventOrEventId={event}
      onlyOneRepository={this.hasOnlyOneRepository()}
    />
  );

  render() {
    const { column, errors, items, loading, subscriptions, style, ...props } = this.props;

    if (!column) return null;

    const title = (column.get('title') || '').toLowerCase();

    const updatedAt = subscriptions && subscriptions.size > 0
      ? subscriptions.first().get('updatedAt')
      : null;

    const icon = (
      subscriptions && subscriptions.size > 0
        ? getRequestTypeIcon(subscriptions.first().get('requestType'))
        : ''
    ) || 'mark-github';

    const dateFromNowText = getDateWithHourAndMinuteText(updatedAt);
    const updatedText = dateFromNowText ? `Updated ${dateFromNowText}` : '';

    return (
      <Root style={style}>
        <Column
          errors={errors}
          headerRight={
            <HeaderButtonsContainer>
              <HeaderButton onPress={this.showActionSheet}>
                <HeaderButtonText><Icon name="settings" size={20} /></HeaderButtonText>
              </HeaderButton>
            </HeaderButtonsContainer>
          }
          icon={icon}
          items={items}
          loading={loading}
          title={title}
          renderRow={this.renderRow}
          refreshFn={this.onRefresh}
          refreshText={updatedText}
          {...props}
        />

        <ActionSheet
          ref={(ref) => { this.ActionSheet = ref; } }
          title={title}
          options={buttons}
          cancelButtonIndex={BUTTONS.CANCEL}
          destructiveButtonIndex={BUTTONS.DELETE_COLUMN}
          onPress={this.handleActionSheetButtonPress}
        />
      </Root>
    );
  }
}
