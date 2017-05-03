// @flow

import alert from '../../libs/alert';
import prompt from '../../libs/prompt';
import { requestTypes } from '../../api/github';
import { generateSubscriptionId } from '../../reducers/entities/subscriptions';
import { getOwnerAndRepo } from '../../utils/helpers/github/shared';
import type { ActionCreators } from '../../utils/types';

export default class {
  static onSelectUserFeedType(
    actions: ActionCreators,
    { createColumnOrder } = {},
  ) {
    const {
      createColumn,
      createSubscription,
      loadUserReceivedEvents,
    } = actions;

    prompt(
      'User feed',
      'Enter the username of a GitHub user. E.g.: gaearon',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create column',
          onPress: username => {
            const params = { username };
            const subscriptionId = generateSubscriptionId(
              requestTypes.USER_RECEIVED_EVENTS,
              params,
            );

            createSubscription(
              subscriptionId,
              requestTypes.USER_RECEIVED_EVENTS,
              params,
            );

            createColumn({
              title: username,
              order: createColumnOrder,
              subscriptionIds: [subscriptionId],
            });

            loadUserReceivedEvents(username);
          },
        },
      ],
      {},
    );
  }

  static onSelectUserType(actions: ActionCreators, { createColumnOrder } = {}) {
    const { createColumn, createSubscription, loadUserEvents } = actions;

    prompt(
      'User events',
      'Enter the username of a GitHub user. E.g.: gaearon',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create column',
          onPress: username => {
            const params = { username };
            const subscriptionId = generateSubscriptionId(
              requestTypes.USER_EVENTS,
              params,
            );

            createSubscription(
              subscriptionId,
              requestTypes.USER_EVENTS,
              params,
            );

            createColumn({
              title: username,
              order: createColumnOrder,
              subscriptionIds: [subscriptionId],
            });

            loadUserEvents(username);
          },
        },
      ],
      {},
    );
  }

  static onSelectRepositoryType(
    actions: ActionCreators,
    { createColumnOrder } = {},
  ) {
    const { createColumn, createSubscription, loadRepoEvents } = actions;

    prompt(
      'Repository events',
      'Enter the repository full name. E.g.: facebook/react',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create column',
          onPress: repoFullName => {
            const { owner, repo } = getOwnerAndRepo(repoFullName);
            if (!(owner && repo)) return;

            const params = { owner, repo };
            const subscriptionId = generateSubscriptionId(
              requestTypes.REPO_EVENTS,
              params,
            );

            createSubscription(
              subscriptionId,
              requestTypes.REPO_EVENTS,
              params,
            );

            createColumn({
              title: repo,
              order: createColumnOrder,
              subscriptionIds: [subscriptionId],
            });

            loadRepoEvents(owner, repo);
          },
        },
      ],
      {},
    );
  }

  static onSelectOrgType(actions: ActionCreators, { createColumnOrder } = {}) {
    const { createColumn, createSubscription, loadOrgEvents } = actions;

    prompt(
      'Organization public events',
      'Enter the organization name. E.g.: facebook',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create column',
          onPress: _org => {
            const org = (_org || '').trim();
            if (!org) return;

            const params = { org };
            const subscriptionId = generateSubscriptionId(
              requestTypes.ORG_PUBLIC_EVENTS,
              params,
            );

            createSubscription(
              subscriptionId,
              requestTypes.ORG_PUBLIC_EVENTS,
              params,
            );

            createColumn({
              title: org,
              order: createColumnOrder,
              subscriptionIds: [subscriptionId],
            });

            loadOrgEvents(org);
          },
        },
      ],
      {},
    );
  }

  static showColumnTypeSelectAlert(actions, params) {
    alert(
      'Create a column',
      'Select the type of the column',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'User feed',
          onPress: () => this.onSelectUserFeedType(actions, params),
        },
        {
          text: 'User events',
          onPress: () => this.onSelectUserType(actions, params),
        },
        {
          text: 'Repository events',
          onPress: () => this.onSelectRepositoryType(actions, params),
        },
        {
          text: 'Organization events',
          onPress: () => this.onSelectOrgType(actions, params),
        },
      ],
      {},
    );
  }
}
