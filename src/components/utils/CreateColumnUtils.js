// @flow

import { Alert, AlertIOS } from 'react-native';

import { requestTypes } from '../../api/github';
import { generateSubscriptionId } from '../../reducers/entities/subscriptions';
import { getOwnerAndRepo } from '../../utils/helpers';
import type { ActionCreators } from '../../utils/types';

export default class {
  static onSelectUserFeedType(actions: ActionCreators) {
    const { createColumn, createSubscription, loadUserReceivedEvents } = actions;

    AlertIOS.prompt(
      'User feed events',
      'Enter the username of a GitHub user. E.g.: gaearon',
      username => {
        const params = { username };
        const subscriptionId = generateSubscriptionId(requestTypes.USER_RECEIVED_EVENTS, params);
        createSubscription(subscriptionId, requestTypes.USER_RECEIVED_EVENTS, params);
        createColumn(username, [subscriptionId]);
        loadUserReceivedEvents(username);
      },
    );
  }

  static onSelectUserType(actions: ActionCreators) {
    const { createColumn, createSubscription, loadUserEvents } = actions;

    AlertIOS.prompt(
      'User events',
      'Enter the username of a GitHub user. E.g.: gaearon',
      username => {
        const params = { username };
        const subscriptionId = generateSubscriptionId(requestTypes.USER_EVENTS, params);
        createSubscription(subscriptionId, requestTypes.USER_EVENTS, params);
        createColumn(username, [subscriptionId]);
        loadUserEvents(username);
      },
    );
  }

  static onSelectRepositoryType(actions: ActionCreators) {
    const { createColumn, createSubscription, loadRepoEvents } = actions;

    AlertIOS.prompt(
      'Repository events',
      'Enter the repository full name. E.g.: facebook/react',
      repoFullName => {
        const { owner, repo } = getOwnerAndRepo(repoFullName);
        if (!(owner && repo)) return;

        const params = { owner, repo };
        const subscriptionId = generateSubscriptionId(requestTypes.REPO_EVENTS, params);
        createSubscription(subscriptionId, requestTypes.REPO_EVENTS, params);
        createColumn(`${owner}/${repo}`, [subscriptionId]);
        loadRepoEvents(owner, repo);
      },
    );
  }

  static onSelectOrgType(actions: ActionCreators) {
    const { createColumn, createSubscription, loadOrgEvents } = actions;

    AlertIOS.prompt(
      'Organization public events',
      'Enter the repository name. E.g.: facebook',
      _org => {
        const org = (_org || '').trim();
        if (!org) return;

        const params = { org };
        const subscriptionId = generateSubscriptionId(requestTypes.ORG_PUBLIC_EVENTS, params);
        createSubscription(subscriptionId, requestTypes.ORG_PUBLIC_EVENTS, params);
        createColumn(org, [subscriptionId]);
        loadOrgEvents(org);
      },
    );
  }

  static showColumnTypeSelectAlert(actions) {
    Alert.alert(
      'Create a column',
      'Select the type of the column',
      [
        { text: 'User feed', onPress: () => this.onSelectUserFeedType(actions) },
        { text: 'User actions', onPress: () => this.onSelectUserType(actions) },
        { text: 'Repository feed', onPress: () => this.onSelectRepositoryType(actions) },
        { text: 'Organization feed', onPress: () => this.onSelectOrgType(actions) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }
}
