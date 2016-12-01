import GitHubAPI from 'github';

const PUBLIC_EVENTS: 'PUBLIC_EVENTS' = 'PUBLIC_EVENTS';
const REPO_EVENTS: 'REPO_EVENTS' = 'REPO_EVENTS';
const REPO_ISSUE_EVENTS: 'REPO_ISSUE_EVENTS' = 'REPO_ISSUE_EVENTS';
const REPO_NETWORK_PUBLIC_EVENTS: 'REPO_NETWORK_PUBLIC_EVENTS' = 'REPO_NETWORK_PUBLIC_EVENTS';
const ORG_PUBLIC_EVENTS: 'ORG_PUBLIC_EVENTS' = 'ORG_PUBLIC_EVENTS';
const USER_RECEIVED_EVENTS: 'USER_RECEIVED_EVENTS' = 'USER_RECEIVED_EVENTS';
const USER_RECEIVED_PUBLIC_EVENTS: 'USER_RECEIVED_PUBLIC_EVENTS' = 'USER_RECEIVED_PUBLIC_EVENTS';
const USER_EVENTS: 'USER_EVENTS' = 'USER_EVENTS';
const USER_PUBLIC_EVENTS: 'USER_PUBLIC_EVENTS' = 'USER_PUBLIC_EVENTS';
const ORG_EVENTS: 'ORG_EVENTS' = 'ORG_EVENTS';

const github = new GitHubAPI();

export const requestTypes = {
  PUBLIC_EVENTS,
  REPO_EVENTS,
  REPO_ISSUE_EVENTS,
  REPO_NETWORK_PUBLIC_EVENTS,
  ORG_PUBLIC_EVENTS,
  USER_RECEIVED_EVENTS,
  USER_RECEIVED_PUBLIC_EVENTS,
  USER_EVENTS,
  USER_PUBLIC_EVENTS,
  ORG_EVENTS,
};

export type ApiRequestType =
  | typeof PUBLIC_EVENTS
  | typeof REPO_EVENTS
  | typeof REPO_ISSUE_EVENTS
  | typeof REPO_NETWORK_PUBLIC_EVENTS
  | typeof ORG_PUBLIC_EVENTS
  | typeof USER_RECEIVED_EVENTS
  | typeof USER_RECEIVED_PUBLIC_EVENTS
  | typeof USER_EVENTS
  | typeof USER_PUBLIC_EVENTS
  | typeof ORG_EVENTS
;

// TODO: Some icons might be wrong, like the ones for organization
export function getIcon(type) {
  switch (type) {
    case requestTypes.PUBLIC_EVENTS: return 'home';
    case requestTypes.REPO_EVENTS: return 'repo';
    case requestTypes.REPO_ISSUE_EVENTS: return 'issue-opened';
    case requestTypes.REPO_NETWORK_PUBLIC_EVENTS: return 'repo';
    case requestTypes.ORG_PUBLIC_EVENTS: return 'organization';
    case requestTypes.USER_RECEIVED_EVENTS: return 'home';
    case requestTypes.USER_RECEIVED_PUBLIC_EVENTS: return 'home';
    case requestTypes.USER_EVENTS: return 'person';
    case requestTypes.USER_PUBLIC_EVENTS: return 'person';
    case requestTypes.ORG_EVENTS: return 'organization';
    default: throw new Error(`No api method configured for type '${type}'`);
  }
}

export function getUniquePath(type: ApiRequestType, { org, owner, repo, username }: Object = {}) {
  return (() => {
    switch (type) {
      case requestTypes.PUBLIC_EVENTS:
        return '/events';

      case requestTypes.REPO_EVENTS:
        if (!(owner && repo)) throw new Error('Required params: owner, repo');
        return `/repos/${owner}/${repo}/events`;

      case requestTypes.REPO_ISSUE_EVENTS:
        if (!(owner && repo)) throw new Error('Required params: owner, repo');
        return `/repos/${owner}/${repo}/issues/events`;

      case requestTypes.REPO_NETWORK_PUBLIC_EVENTS:
        if (!(owner && repo)) throw new Error('Required params: owner, repo');
        return `/networks/${owner}/${repo}/events`;

      case requestTypes.ORG_PUBLIC_EVENTS:
        if (!repo) throw new Error('Required params: repo');
        return `/orgs/${org}/events`;

      case requestTypes.USER_RECEIVED_EVENTS:
        if (!username) throw new Error('Required params: username');
        return `/users/${username}/received_events`;

      case requestTypes.USER_RECEIVED_PUBLIC_EVENTS:
        if (!username) throw new Error('Required params: username');
        return `/users/${username}/received_events/public`;

      case requestTypes.USER_EVENTS:
        if (!username) throw new Error('Required params: username');
        return `/users/${username}/events`;

      case requestTypes.USER_PUBLIC_EVENTS:
        if (!username) throw new Error('Required params: username');
        return `/users/${username}/events/public`;

      case requestTypes.ORG_EVENTS:
        if (!username) throw new Error('Required params: username');
        return `/users/${username}/events/orgs/${org}`;

      default: throw new Error(`No path configured for type '${type}'`);
    }
  })().toLowerCase();
}

export function getApiMethod(type) {
  switch (type) {
    case requestTypes.PUBLIC_EVENTS: return github.activity.getEvents;
    case requestTypes.REPO_EVENTS: return github.activity.getEventsForRepo;
    case requestTypes.REPO_ISSUE_EVENTS: return github.activity.getEventsForRepoIssues;
    case requestTypes.REPO_NETWORK_PUBLIC_EVENTS: return github.activity.getEventsForRepoNetwork;
    case requestTypes.ORG_PUBLIC_EVENTS: return github.activity.getEventsForOrg;
    case requestTypes.USER_RECEIVED_EVENTS: return github.activity.getEventsReceived;
    case requestTypes.USER_RECEIVED_PUBLIC_EVENTS: return github.activity.getEventsReceivedPublic;
    case requestTypes.USER_EVENTS: return github.activity.getEventsForUser;
    case requestTypes.USER_PUBLIC_EVENTS: return github.activity.getEventsForUserPublic;
    case requestTypes.ORG_EVENTS: return github.activity.getEventsForUserOrg;
    default: throw new Error(`No api method configured for type '${type}'`);
  }
}

export function fetch(type) {
  const method = getApiMethod(type);
  return method();
}

export default github;
