// @flow

import React from 'react';

import Column from './_Column';
import NotificationCardContainer from '../../containers/NotificationCardContainer';
import { getDateWithHourAndMinuteText, getOwnerAndRepo } from '../../utils/helpers';
import { getParamsToLoadAllNotifications } from '../../sagas/notifications';
import type { ActionCreators, GithubRepo } from '../../utils/types';

export default class extends React.PureComponent {
  onRefresh = () => {
    const { actions: { updateNotifications } } = this.props;

    const params = getParamsToLoadAllNotifications();
    updateNotifications(params);
  };

  props: {
    actions: ActionCreators,
    column: { repo: GithubRepo },
    errors?: ?Array<string>,
    icon?: string,
    items: Array<Object>,
    loading: boolean,
    notificationsDetails: Object,
    radius?: number,
    style?: ?Object,
    seenIds: Array<string>,
    title?: string,
    updatedAt: Date,
  };

  renderRow = (notification) => (
    <NotificationCardContainer
      key={`notification-card-${notification.get('id')}`}
      actions={this.props.actions}
      notificationOrNotificationId={notification.get('id')}
      onlyOneRepository={!!this.props.column.get('repo')}
    />
  );

  render() {
    const { column,
      errors,
      icon: _icon,
      items,
      loading,
      title: _title,
      updatedAt,
      ...props
    } = this.props;

    if (!column) return null;

    const repo = column.get('repo');

    let title = _title;
    if (!title) {
      if (repo) {
        const { repo: repoName } = getOwnerAndRepo(repo.get('full_name') || repo.get('name'));
        title = (repoName || '').toLowerCase();
      }

      if (!title) title = 'notifications';
    }

    let icon = _icon;
    if (!icon){
      icon = repo ? 'repo' : 'bell';
    }

    const dateFromNowText = getDateWithHourAndMinuteText(updatedAt);
    const refreshText = dateFromNowText ? `Updated ${dateFromNowText}` : '';

    return (
      <Column
        errors={errors}
        icon={icon}
        items={items}
        loading={loading}
        title={title}
        renderRow={this.renderRow}
        refreshFn={this.onRefresh}
        refreshText={refreshText}
        {...props}
      />
    );
  }
}
