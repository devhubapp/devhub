// @flow

import ActionSheet from 'react-native-actionsheet';
import React from 'react';
import { Iterable, List, Set } from 'immutable';

import ColumnWithList, {
  HeaderButton,
  HeaderButtonIcon,
  HeaderButtonsContainer,
} from './_ColumnWithList';
import { defaultIcon as summaryIcon } from './NotificationsFilterColumn';
import NotificationsFilterColumnContainer from '../../containers/NotificationsFilterColumnContainer';
import NotificationCardContainer from '../../containers/NotificationCardContainer';
import { FullAbsoluteView, FullView } from '../cards/__CardComponents';
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

export const defaultIcon = 'bell';
export const defaultTitle = 'notifications';

export default class extends React.PureComponent {
  static contextTypes = { store: React.PropTypes.object.isRequired };

  static defaultProps = {
    icon: undefined,
    title: undefined,
    style: undefined,
    repo: undefined,
  }

  state = {
    summary: false,
  };

  onRefresh = () => {
    const { actions: { updateNotifications } } = this.props;

    const params = getParamsToLoadAllNotifications();
    updateNotifications(params);
  };

  getNotificationIds = () => {
    const { items = List() } = this.props;
    return items.first() === 'string'
      ? items
      : items.map(item => (Iterable.isIterable(item) ? item.get('id') : item));
  };

  getReadNotificationIds = () => {
    const store = this.context.store;
    const state = store.getState();

    const notificationIds = this.getNotificationIds();
    const readNotificationsIds = readNotificationIdsSelector(state);
    return Set(readNotificationsIds).intersect(notificationIds);
  };

  getUnreadNotificationIds = () => {
    const notificationIds = this.getNotificationIds();
    const readNotificationsIds = this.getReadNotificationIds();
    return Set(notificationIds).subtract(readNotificationsIds);
  };

  getRightHeader = (isSummary) => (
    <HeaderButtonsContainer>
      <HeaderButton onPress={this.toggleSummary}>
        <HeaderButtonIcon name={summaryIcon} active={isSummary} />
      </HeaderButton>

      <HeaderButton onPress={this.showActionSheet} disabled={isSummary}>
        <HeaderButtonIcon name="chevron-down" muted={isSummary} />
      </HeaderButton>
    </HeaderButtonsContainer>
  );

  toggleSummary = () => {
    this.setState(({ summary }) => ({ summary: !summary }));
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  handleActionSheetButtonPress = index => {
    const { actions, column, repo } = this.props;

    const repoId = repo ? repo.get('id') : column.get('repoId');

    const readIds = this.getReadNotificationIds();
    const notificationIds = this.getNotificationIds();

    switch (index) {
      case BUTTONS.MARK_NOTIFICATIONS_AS_READ_OR_UNREAD:
        (() => {
          if (readIds && readIds.size >= notificationIds.size) {
            actions.markNotificationsAsUnread({
              all: true,
              notificationIds: readIds,
              repoId,
            });
          } else {
            const unreadIds = this.getUnreadNotificationIds();
            actions.markNotificationsAsReadRequest({
              all: true,
              notificationIds: unreadIds,
              repoId,
            });
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
    column: {repoId: string},
    icon?: string,
    items: Array<Object>,
    loading: boolean,
    notificationsDetails: Object,
    style?: ?Object,
    readIds: Array<string>,
    repo?: GithubRepo,
    title?: string,
    updatedAt: Date
  };

  renderRow = notificationOrNotificationId => {
    const { actions, column, repo } = this.props;

    const notification = Iterable.isIterable(notificationOrNotificationId)
      ? notificationOrNotificationId
      : null;

    const notificationId = notification
      ? `${notification.get('id')}`
      : notificationOrNotificationId;
    if (!notificationId) return null;

    return (
      <NotificationCardContainer
        key={`notification-card-container-${notificationId}`}
        actions={actions}
        notificationOrNotificationId={notificationId}
        onlyOneRepository={
          !!(repo || column.get('repoId'))
        }
      />
    );
  };

  render() {
    const { summary } = this.state;
    const {
      column,
      icon: _icon,
      items,
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
        const { repo: repoName } = getOwnerAndRepo(
          repo.get('full_name') || repo.get('name'),
        );
        title = (repoName || '').toLowerCase();
      }

      if (!title) title = defaultTitle;
    }

    let icon = _icon;
    if (!icon) {
      icon = repo || column.get('repoId') ? 'repo' : defaultIcon;
    }

    return (
      <FullView style={style}>
        <ColumnWithList
          {...props}
          key={`notification-_ColumnWithList-${column.get('id')}`}
          rightHeader={this.getRightHeader(false)}
          icon={icon}
          items={items}
          title={title}
          refreshFn={this.onRefresh}
          renderRow={this.renderRow}
          updatedAt={updatedAt}
        />

        <ActionSheet
          ref={ref => {
            this.ActionSheet = ref;
          }}
          title={title}
          options={buttons}
          cancelButtonIndex={BUTTONS.CANCEL}
          destructiveButtonIndex={BUTTONS.DELETE_COLUMN}
          onPress={this.handleActionSheetButtonPress}
        />

        {
          summary && (
            <FullAbsoluteView key={`notifications-gcc-${column.get('id')}-FullAbsoluteView`}>
              <NotificationsFilterColumnContainer
                {...props}
                key={`notifications-filter-column-container-${column.get('id')}`}
                column={column}
                icon={icon}
                title={title}
                refreshFn={this.onRefresh}
                renderRow={this.renderRow}
                rightHeader={this.getRightHeader(true)}
                updatedAt={null}
              />
            </FullAbsoluteView>
          )
        }
      </FullView>
    );
  }
}
