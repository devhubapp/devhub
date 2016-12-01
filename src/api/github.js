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

const github = new GitHubAPI({
  debug: process.env.NODE_ENV !== 'production',
});

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
  | PUBLIC_EVENTS
  | REPO_EVENTS
  | REPO_ISSUE_EVENTS
  | REPO_NETWORK_PUBLIC_EVENTS
  | ORG_PUBLIC_EVENTS
  | USER_RECEIVED_EVENTS
  | USER_RECEIVED_PUBLIC_EVENTS
  | USER_EVENTS
  | USER_PUBLIC_EVENTS
  | ORG_EVENTS
;

export function getPath(type: ApiRequestType, { org, owner, repo, username } = {}) {
  switch (type) {
    case requestTypes.PUBLIC_EVENTS: return '/events';
    case requestTypes.REPO_EVENTS: return `/repos/${owner}/${repo}/events`;
    case requestTypes.REPO_ISSUE_EVENTS: return `/repos/${owner}/${repo}/issues/events`;
    case requestTypes.REPO_NETWORK_PUBLIC_EVENTS: return `/networks/${owner}/${repo}/events`;
    case requestTypes.ORG_PUBLIC_EVENTS: return `/orgs/${org}/events`;
    case requestTypes.USER_RECEIVED_EVENTS: return `/users/${username}/received_events`;
    case requestTypes.USER_RECEIVED_PUBLIC_EVENTS: return `/users/${username}/received_events/public`;
    case requestTypes.USER_EVENTS: return `/users/${username}/events`;
    case requestTypes.USER_PUBLIC_EVENTS: return `/users/${username}/events/public`;
    case requestTypes.ORG_EVENTS: return `/users/${username}/events/orgs/${org}`;
    default: throw new Error(`No path configured for type '${type}'`);
  }
}

export function fetch(type, params) {
  switch (type) {
    case requestTypes.PUBLIC_EVENTS: return '/events';
    case requestTypes.REPO_EVENTS: return `/repos/${owner}/${repo}/events`;
    case requestTypes.REPO_ISSUE_EVENTS: return `/repos/${owner}/${repo}/issues/events`;
    case requestTypes.REPO_NETWORK_PUBLIC_EVENTS: return `/networks/${owner}/${repo}/events`;
    case requestTypes.ORG_PUBLIC_EVENTS: return `/orgs/${org}/events`;
    case requestTypes.USER_RECEIVED_EVENTS: return `/users/${username}/received_events`;
    case requestTypes.USER_RECEIVED_PUBLIC_EVENTS: return `/users/${username}/received_events/public`;
    case requestTypes.USER_EVENTS: return `/users/${username}/events`;
    case requestTypes.USER_PUBLIC_EVENTS: return `/users/${username}/events/public`;
    case requestTypes.ORG_EVENTS: return `/users/${username}/events/orgs/${org}`;
    default: throw new Error(`No path configured for type '${type}'`);
  }
}

export default github;
