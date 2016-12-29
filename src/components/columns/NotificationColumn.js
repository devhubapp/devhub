// @flow

import React from 'react';

import Column from './_Column';
import NotificationCardContainer from '../../containers/NotificationCardContainer';
import { getDateWithHourAndMinuteText, getOwnerAndRepo } from '../../utils/helpers';
import type { ActionCreators, Repo } from '../../utils/types';

export default class extends React.PureComponent {
  onRefresh = () => {
    const { actions: { updateNotificationsRequest } } = this.props;
    updateNotificationsRequest();
  };

  props: {
    actions: ActionCreators,
    column: { repo: Repo },
    errors?: ?Array<string>,
    items: Array<Object>,
    loading?: boolean,
    notificationsDetails: Object,
    radius?: number,
    style?: ?Object,
    seenIds: Array<string>,
    updatedAt: Date,
  };

  renderRow = (notification) => (
    <NotificationCardContainer
      key={`notification-card-${notification.get('id')}`}
      actions={this.props.actions}
      notificationOrNotificationId={notification}
    />
  );

  render() {
    const { column, errors, items, loading, updatedAt, ...props } = this.props;

    if (!column || !column.get('repo')) return null;

    const icon = 'repo';
    const repo = column.get('repo');
    const { repo: repoName } = getOwnerAndRepo(repo.get('full_name') || repo.get('name'));
    const title = (repoName || '').toLowerCase();

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
