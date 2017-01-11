// @flow
/* eslint-disable import/prefer-default-export */

import { capitalize, camelCase } from 'lodash';
import { fromJS, List, Map, OrderedMap } from 'immutable';

import * as baseTheme from '../../../styles/themes/base';
import { getIssueIconAndColor, getPullRequestIconAndColor } from './shared';
import { isArchivedFilter, isReadFilter } from '../../../selectors';

import type {
  GithubIcon,
  GithubNotification,
  GithubNotificationReason,
  ThemeObject,
} from '../../types';

export const notificationReasons = [
  'assign',
  'author',
  'comment',
  'invitation',
  'manual',
  'mention',
  'state_change',
  'subscribed',
  'team_mention'
];

export function getNotificationReasonTextsAndColor(
  notification: GithubNotification,
  theme?: ThemeObject = baseTheme
): { color: string, reason: string, label: string, description: string } {
  const reason: GithubNotificationReason = notification.get('reason');

  switch (reason) {
    case 'assign':
      return { color: theme.pink, reason, label: 'Assigned', description: 'You were assigned to this thread' };

    case 'author':
      return { color: theme.lightRed, reason, label: 'Author', description: 'You created this thread' };

    case 'comment':
      return { color: theme.blue, reason, label: 'Commented', description: 'You commented on the thread' };

    case 'invitation':
      return { color: theme.brown, reason, label: 'Invited', description: 'You accepted an invitation to contribute to the repository' };

    case 'manual':
      return { color: theme.teal, reason, label: 'Subscribed', description: 'You subscribed to the thread' };

    case 'mention':
      return { color: theme.orange, reason, label: 'Mentioned', description: 'You were @mentioned' };

    case 'state_change':
      return { color: theme.purple, reason, label: 'State changed', description: 'You changed the thread state' };

    case 'subscribed':
      return { color: theme.blueGray, reason, label: 'Watching', description: 'You\'re watching this repository' };

    case 'team_mention':
      return { color: theme.yellow, reason, label: 'Team mentioned', description: 'Your team was mentioned' };

    default: return { color: theme.gray, reason, label: capitalize(reason), description: '' };
  }
}

export function getNotificationIconAndColor(
  notification: GithubNotification,
  theme?: ThemeObject,
): { icon: GithubIcon, color?: string } {
  const subject = notification.get('subject');
  const type = subject.get('type').toLowerCase();

  switch (type) {
    case 'commit': return { icon: 'git-commit' };
    case 'issue': return getIssueIconAndColor(subject, theme);
    case 'pullrequest': return getPullRequestIconAndColor(subject, theme );
    default: return 'bell';
  }
}

export function groupNotificationsByRepository(
  notifications: Array<GithubNotification>,
  { includeAllGroup = false, includeFilterGroup = false }:
  { includeAllGroup?: boolean, includeFilterGroup?: boolean } = {}
) {
  let groupedNotifications = OrderedMap();
  
  if (includeFilterGroup) {
    groupedNotifications = groupedNotifications.concat(Map({
      filter: Map({
        id: 'filter',
        notifications,
        title: 'filter',
      }),
    }));
  }
  
  if (includeAllGroup) {
    groupedNotifications = groupedNotifications.concat(Map({
      all: Map({
        id: 'all',
        notifications,
        title: 'notifications',
      }),
    }));
  }

  notifications.forEach((notification) => {
    const repo = notification.get('repository');
    const repoId = `${repo.get('id')}`;

    let group = groupedNotifications.get(repoId);
    if (!group) {
      group = Map({ id: repoId, repo, notifications: List() });
      groupedNotifications = groupedNotifications.set(repoId, group);
    }

    groupedNotifications = groupedNotifications.updateIn([repoId, 'notifications'], (notif) => (
      notif.push(notification)
    ));
  });

  return groupedNotifications;
}

const reasonToColorAndTitle = (reason) => {
  const { color, label: title } = getNotificationReasonTextsAndColor(Map({ reason }));
  return { color, title };
};

const defaultFilterColumnsCounters = {
  read: 0,
  unread: 0,
};

const defaultFilterColumnsRepoData = OrderedMap({
  icon: 'repo',
  ...defaultFilterColumnsCounters,
});

export const defaultFilterColumnsData = OrderedMap({
  inboxes: OrderedMap(fromJS({
    inbox: {
      icon: 'inbox',
      color: baseTheme.teal,
      title: 'Inbox',
      ...defaultFilterColumnsCounters,
    },
    archived: {
      icon: 'check',
      color: baseTheme.green,
      title: 'Archived',
      ...defaultFilterColumnsCounters,
    },
  })),

  readStatus: OrderedMap(fromJS({
    read: {
      icon: 'mail',
      title: 'Read',
      ...defaultFilterColumnsCounters,
    },
    unread: {
      icon: 'mail-read',
      title: 'Unread',
      ...defaultFilterColumnsCounters,
    },
  })),
  subjectTypes: OrderedMap(fromJS({
    commit: {
      icon: 'git-commit',
      title: 'Commit',
      ...defaultFilterColumnsCounters,
    },
    issue: {
      icon: 'issue-opened',
      title: 'Issue',
      ...defaultFilterColumnsCounters,
    },
    pullRequest: {
      icon: 'git-pull-request',
      title: 'Pull Request',
      ...defaultFilterColumnsCounters,
    },
  })),
  reasons: OrderedMap(
    List(notificationReasons).toOrderedMap().mapEntries(([, reason]) => (
      [reason, Map({
        icon: 'primitive-dot',
        ...reasonToColorAndTitle(reason),
        ...defaultFilterColumnsCounters,
      })]
    ))
  ),
  repos: OrderedMap(),
});
//
export function notificationsToFilterColumnData(notifications) {
  let result = defaultFilterColumnsData;
  if (!notifications) return result;

  notifications.forEach((notification) => {
    const isArchived = isArchivedFilter(notification);
    const isRead = isReadFilter(notification);
    const counterPath = isRead ? 'read' : 'unread';

    let count;
    let path;
    let partialPath;

    // inboxes
    partialPath = isArchived ? 'archived' : 'inbox';
    path = ['inboxes', partialPath, counterPath];

    count = result.getIn(path) || 0;
    result = result.setIn(path, count + 1);

    // readStatus
    partialPath = isRead ? 'read' : 'unread';
    path = ['readStatus', partialPath, counterPath];
    count = result.getIn(path) || 0;
    result = result.setIn(path, count + 1);

    // subjectTypes
    partialPath = camelCase(notification.getIn(['subject', 'type']));
    path = ['subjectTypes', partialPath, counterPath];
    count = result.getIn(path) || 0;
    result = result.setIn(path, count + 1);

    // reasons
    partialPath = notification.get('reason');
    path = ['reasons', partialPath, counterPath];//
    count = result.getIn(path) || 0;
    result = result.setIn(path, count + 1);

    // repos
    partialPath = notification.getIn(['repository', 'full_name']);
    path = ['repos', partialPath];
    if (!result.getIn(path)) result = result.setIn(path, defaultFilterColumnsRepoData);
    path = [...path, counterPath];
    count = result.getIn(path) || 0;
    result = result.setIn(path, count + 1);
  });

  return result;
}
