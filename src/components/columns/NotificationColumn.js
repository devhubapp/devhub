// @flow

import ActionSheet from 'react-native-actionsheet';
import React from 'react';
import { Iterable, List, Set } from 'immutable';

import ColumnWithList, { HeaderButton, HeaderButtonIcon, HeaderButtonsContainer } from './_ColumnWithList';
import NotificationCardContainer from '../../containers/NotificationCardContainer';
import { FullView } from '../cards/__CardComponents';
import { getOwnerAndRepo } from '../../utils/helpers';
import { getParamsToLoadAllNotifications } from '../../sagas/notifications';
import { readNotificationIdsSelector } from '../../selectors';
import type { ActionCreators, GithubRepo } from '../../utils/types';

const buttons = ['Cancel', 'Mark all as read / unread', 'Clear read'];
const BUTTONS = {
  CANCEL: 0,
  MARK_NOTIFICATIONS_AS_READ_OR_UNREAD: 1,
  ARCHIVE_READ: 2,
};

export default class extends React.PureComponent {
  static contextTypes = {
    store: React.PropTypes.object.isRequired,
  };

  onRefresh = () => {
    const { actions: { updateNotifications } } = this.props;

    const params = getParamsToLoadAllNotifications();
    updateNotifications(params);
  };

  getNotificationIds = () => {
    const { items = List() } = this.props;
    return items.first() === 'string' ? items : items.map(item => item.get('id'));
  }

  getReadNotificationIds = () => {
    const store = this.context.store;
    const state = store.getState();

    const notificationIds = this.getNotificationIds();
    const readNotificationsIds = readNotificationIdsSelector(state);
    return Set(readNotificationsIds).intersect(notificationIds);
  }

  getUnreadNotificationIds = () => {
    const notificationIds = this.getNotificationIds();
    const readNotificationsIds = this.getReadNotificationIds();
    return Set(notificationIds).subtract(readNotificationsIds);
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  handleActionSheetButtonPress = (index) => {
    const { actions, column, repo } = this.props;

    const repoId = repo ? repo.get('id') : repo.get('repoId');

    const readIds = this.getReadNotificationIds();
    const notificationIds = this.getNotificationIds();

    switch (index) {
      case BUTTONS.MARK_NOTIFICATIONS_AS_READ_OR_UNREAD:
        (() => {
          if (readIds && readIds.size >= notificationIds.size) {
            actions.markNotificationsAsUnread({ all: true, notificationIds: readIds, repoId });
          } else {
            const unreadIds = this.getUnreadNotificationIds();
            actions.markNotificationsAsReadRequest({ all: true, notificationIds: unreadIds, repoId });
          }
        })();

        break;

      case BUTTONS.ARCHIVE_READ:
        (() => {
          const all = readIds.size === notificationIds.size;
          actions.archiveNotifications({ all, notificationIds: readIds, repoId });
        })();
        break;

      default:
        break;
    }
  };

  props: {
    actions: ActionCreators,
    column: { repoId: string },
    errors?: ?Array<string>,
    icon?: string,
    items: Array<Object>,
    loading: boolean,
    notificationsDetails: Object,
    radius?: number,
    style?: ?Object,
    readIds: Array<string>,
    repo?: GithubRepo,
    title?: string,
    updatedAt: Date,
  };

  renderRow = (notificationOrNotificationId) => {
    const notification = Iterable.isIterable(notificationOrNotificationId)
      ? notificationOrNotificationId
      : null
    ;

    const notificationId = notification ? `${notification.get('id')}` : notificationOrNotificationId;

    return (
      <NotificationCardContainer
        key={`notification-card-${notificationId}`}
        actions={this.props.actions}
        notificationOrNotificationId={notificationId}
        onlyOneRepository={!!this.props.column.get('repo')}
      />
    );
  };

  render() {
    const { column,
      errors,
      icon: _icon,
      items,
      loading,
      repo,
      style,
      title: _title,
      updatedAt,
      ...props
    } = this.props;

    if (!column) return null;

    let title = _title;
    if (!title) {
      if (repo) {
        const { repo: repoName } = getOwnerAndRepo(repo.get('full_name') || repo.get('name'));
        title = (repoName || '').toLowerCase();
      }

      if (!title) title = 'notifications';
    }

    let icon = _icon;
    if (!icon) {
      icon = repo || column.get('repoId') ? 'repo' : 'bell';
    }

    return (
      <FullView style={style}>
        <ColumnWithList
          errors={errors}
          headerRight={
            <HeaderButtonsContainer>
              <HeaderButton onPress={this.showActionSheet}>
                <HeaderButtonIcon name="chevron-down" />
              </HeaderButton>
            </HeaderButtonsContainer>
          }
          icon={icon}
          items={items}
          loading={loading}
          title={title}
          refreshFn={this.onRefresh}
          renderRow={this.renderRow}
          updatedAt={updatedAt}
          {...props}
        />

        <ActionSheet
          ref={(ref) => { this.ActionSheet = ref; }}
          title={title}
          options={buttons}
          cancelButtonIndex={BUTTONS.CANCEL}
          destructiveButtonIndex={BUTTONS.DELETE_COLUMN}
          onPress={this.handleActionSheetButtonPress}
        />
      </FullView>
    );
  }
}
