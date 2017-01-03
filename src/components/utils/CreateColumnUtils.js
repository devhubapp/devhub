// @flow

import prompt from 'react-native-prompt-android';
import { Alert } from 'react-native';

import { requestTypes } from '../../api/github';
import { generateSubscriptionId } from '../../reducers/entities/subscriptions';
import { getOwnerAndRepo } from '../../utils/helpers';
import type { ActionCreators } from '../../utils/types';

export default class {
  static onSelectUserFeedType(actions: ActionCreators) {
    const { createColumn, createSubscription, loadUserReceivedEvents } = actions;

    prompt(
      'User feed',
      'Enter the username of a GitHub user. E.g.: gaearon',
      [
        { text: 'Cancel', style: 'cancel'},
        {
          text: 'Create column',
          onPress: (username) => {
            const params = { username };
            const subscriptionId = generateSubscriptionId(requestTypes.USER_RECEIVED_EVENTS, params);
            createSubscription(subscriptionId, requestTypes.USER_RECEIVED_EVENTS, params);
            createColumn(username, [subscriptionId]);
            loadUserReceivedEvents(username);
          },
        },
      ],
      {},
    );
  }

  static onSelectUserType(actions: ActionCreators) {
    const { createColumn, createSubscription, loadUserEvents } = actions;

    prompt(
      'User events',
      'Enter the username of a GitHub user. E.g.: gaearon',
      [
        { text: 'Cancel', style: 'cancel'},
        {
          text: 'Create column',
          onPress: (username) => {
            const params = { username };
            const subscriptionId = generateSubscriptionId(requestTypes.USER_EVENTS, params);
            createSubscription(subscriptionId, requestTypes.USER_EVENTS, params);
            createColumn(username, [subscriptionId]);
            loadUserEvents(username);
          },
        },
      ],
      {},
    );
  }

  static onSelectRepositoryType(actions: ActionCreators) {
    const { createColumn, createSubscription, loadRepoEvents } = actions;

    prompt(
      'Repository events',
      'Enter the repository full name. E.g.: facebook/react',
      [
        { text: 'Cancel', style: 'cancel'},
        {
          text: 'Create column',
          onPress: (repoFullName) => {
            const { owner, repo } = getOwnerAndRepo(repoFullName);
            if (!(owner && repo)) return;

            const params = { owner, repo };
            const subscriptionId = generateSubscriptionId(requestTypes.REPO_EVENTS, params);
            createSubscription(subscriptionId, requestTypes.REPO_EVENTS, params);
            createColumn(repo, [subscriptionId]);
            loadRepoEvents(owner, repo);
          },
        },
      ],
      {},
    );
  }

  static onSelectOrgType(actions: ActionCreators) {
    const { createColumn, createSubscription, loadOrgEvents } = actions;

    prompt(
      'Organization public events',
      'Enter the organization name. E.g.: facebook',
      [
        { text: 'Cancel', style: 'cancel'},
        {
          text: 'Create column',
          onPress: (_org) => {
            const org = (_org || '').trim();
            if (!org) return;

            const params = { org };
            const subscriptionId = generateSubscriptionId(requestTypes.ORG_PUBLIC_EVENTS, params);
            createSubscription(subscriptionId, requestTypes.ORG_PUBLIC_EVENTS, params);
            createColumn(org, [subscriptionId]);
            loadOrgEvents(org);
          },
        },
      ],
      {},
    );
  }

  static showColumnTypeSelectAlert(actions) {
    Alert.alert(
      'Create a column',
      'Select the type of the column',
      [
        { text: 'User feed', onPress: () => this.onSelectUserFeedType(actions) },
        { text: 'User events', onPress: () => this.onSelectUserType(actions) },
        { text: 'Repository events', onPress: () => this.onSelectRepositoryType(actions) },
        { text: 'Organization events', onPress: () => this.onSelectOrgType(actions) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }
}
