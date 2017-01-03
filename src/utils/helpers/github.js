// @flow
/* eslint-disable import/prefer-default-export */

import gravatar from 'gravatar';
import max from 'lodash/max';
import moment from 'moment';
import { Linking } from 'react-native';
import { fromJS, List, Map, OrderedMap } from 'immutable';

import baseTheme from '../../styles/themes/base';

import type {
    GithubEvent,
    GithubEventType,
    GithubIcon,
    GithubIssue,
    GithubNotification,
    GithubNotificationReason,
    GithubPullRequest,
    GithubRepo,
    ThemeObject,
  } from '../types';

export const baseURL = 'https://github.com';

export function getIssueIconAndColor(issue: GithubIssue, theme?: ThemeObject = baseTheme)
: { color: string, icon: string } {
  const state = issue.get('state');

  switch (state) {
    case 'open':
      return { icon: 'issue-opened', color: theme.green };

    case 'closed':
      return { icon: 'issue-closed', color: theme.red };

    default:
      return { icon: 'issue-opened' };
  }
}

export function getPullRequestIconAndColor(
  pullRequest: GithubPullRequest,
  theme?: ThemeObject = baseTheme
) : { color: string, icon: string } {
  const merged = pullRequest.get('merged_at');
  const state = merged ? 'merged' : pullRequest.get('state');

  switch (state) {
    case 'open':
      return { icon: 'git-pull-request', color: theme.green };

    case 'closed':
      return { icon: 'git-pull-request', color: theme.red };

    case 'merged':
      return { icon: 'git-merge', color: theme.purple };

    default:
      return { icon: 'git-pull-request' };
  }
}

export function getNotificationReasonTextsAndColor(
  notification: GithubNotification,
  theme?: ThemeObject = baseTheme
): { color: string, reason: string, label: string, description: string } {
  const reason: GithubNotificationReason = notification.get('reason');

  switch (reason) {
    case 'assign':
      return { color: theme.pink, reason, label: 'assigned', description: 'You were assigned to this thread' };

    case 'author':
      return { color: theme.lightRed, reason, label: 'author', description: 'You created this thread' };

    case 'comment':
      return { color: theme.blue, reason, label: 'commented', description: 'You commented on the thread' };

    case 'invitation':
      return { color: theme.brown, reason, label: 'invited', description: 'You accepted an invitation to contribute to the repository' };

    case 'manual':
      return { color: theme.teal, reason, label: 'subscribed', description: 'You subscribed to the thread' };

    case 'mention':
      return { color: theme.orange, reason, label: 'mentioned', description: 'You were @mentioned' };

    case 'state_change':
      return { color: theme.purple, reason, label: 'state changed', description: 'You changed the thread state' };

    case 'subscribed':
      return { color: theme.blueGray, reason, label: 'watching', description: 'You\'re watching this repository' };

    case 'team_mention':
      return { color: theme.yellow, reason, label: 'team mentioned', description: 'Your team was mentioned' };

    default: return { color: theme.gray, reason, label: reason, description: '' };
  }
}

export function getEventIconAndColor(event: GithubEvent, theme?: ThemeObject = baseTheme):
{ icon: GithubIcon, color?: string } {
  const eventType = event.get('type').split(':')[0];
  const payload = event.get('payload');

  switch (eventType) {
    case 'CommitCommentEvent': return { icon: 'comment-discussion' }; // git-commit
    case 'CreateEvent':
      switch (payload.get('ref_type')) {
        case 'repository': return { icon: 'repo' };
        case 'branch': return { icon: 'git-branch' };
        case 'tag': return { icon: 'tag' };
        default: return { icon: 'plus' };
      }
    case 'DeleteEvent':
      switch (payload.get('ref_type')) {
        case 'repository': return { icon: 'repo' }; // probably not used
        case 'branch': return { icon: 'git-branch' };
        case 'tag': return { icon: 'tag' };
        default: return { icon: 'trashcan' };
      }
    case 'GollumEvent': return { icon: 'book' };
    case 'ForkEvent': return { icon: 'repo-forked' };
    case 'IssueCommentEvent': return { icon: 'comment-discussion' };
    case 'IssuesEvent':
      return (() => {
        const issue = payload.get('issue');

        switch (payload.get('action')) {
          case 'opened': return getIssueIconAndColor(Map({ state: 'open' }), theme);
          case 'closed': return getIssueIconAndColor(Map({ state: 'closed' }), theme);

          case 'reopened':
            return {
              ...getIssueIconAndColor(Map({ state: 'open' }), theme),
              icon: 'issue-reopened',
            };

          // case 'assigned':
          // case 'unassigned':
          // case 'labeled':
          // case 'unlabeled':
          // case 'edited':
          // case 'milestoned':
          // case 'demilestoned':
          default: return getIssueIconAndColor(issue, theme);
        }
      })();
    case 'MemberEvent': return { icon: 'person' };
    case 'PublicEvent': return { icon: 'globe' };

    case 'PullRequestEvent':
      return (() => {
        const pullRequest = payload.get('pull_request');

        switch (payload.get('action')) {
          case 'opened':
          case 'reopened': return getPullRequestIconAndColor(Map({ state: 'open' }), theme);

          // case 'closed': return getPullRequestIconAndColor(Map({ state: 'closed' }), theme);

          // case 'assigned':
          // case 'unassigned':
          // case 'labeled':
          // case 'unlabeled':
          // case 'edited':
          default: return getPullRequestIconAndColor(pullRequest, theme);
        }
      })();

    case 'PullRequestReviewEvent':
    case 'PullRequestReviewCommentEvent': return { icon: 'comment-discussion' };
    case 'PushEvent': return { icon: 'code' };
    case 'ReleaseEvent': return { icon: 'tag' };
    case 'WatchEvent': return { icon: 'star' };
    default: return { icon: 'mark-github' };
  }
}

export function getNotificationIconAndColor(
  notification: GithubNotification,
  theme?: ThemeObject
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

type GetEventTextOptions = { issueIsKnown: ?boolean, repoIsKnown: ?boolean };
export function getEventText(event: GithubEvent, options: ?GetEventTextOptions): string {
  const eventType = event.get('type');
  const payload = event.get('payload');

  const { issueIsKnown, repoIsKnown } = options || {};

  const issueText = issueIsKnown ? 'this issue' : 'an issue';
  const repositoryText = repoIsKnown ? 'this repository' : 'a repository';

  const text = (() => {
    switch (eventType) {
      case 'CommitCommentEvent': return 'commented on a commit';
      case 'CreateEvent':
        switch (payload.get('ref_type')) {
          case 'repository': return `created ${repositoryText}`;
          case 'branch': return 'created a branch';
          case 'tag': return 'created a tag';
          default: return 'created something';
        }
      case 'DeleteEvent':
        switch (payload.get('ref_type')) {
          case 'repository': return `deleted ${repositoryText}`;
          case 'branch': return 'deleted a branch';
          case 'tag': return 'deleted a tag';
          default: return 'deleted something';
        }
      case 'GollumEvent':
        return (() => {
          const count = (payload.get('pages') || List([])).size || 1;
          const pagesText = count > 1 ? `${count} wiki pages` : 'a wiki page';
          switch (((payload.get('pages') || List([]))[0] || Map()).get('action')) {
            case 'created': return `created ${pagesText}`;
            default: return `updated ${pagesText}`;
          }
        })();
      case 'ForkEvent': return `forked ${repositoryText}`;
      case 'IssueCommentEvent': return `commented on ${issueText}`;
      case 'IssuesEvent': // TODO: Fix these texts
        switch (payload.get('action')) {
          case 'closed': return `closed ${issueText}`;
          case 'reopened': return `reopened ${issueText}`;
          case 'opened': return `opened ${issueText}`;
          case 'assigned': return `assigned ${issueText}`;
          case 'unassigned': return `unassigned ${issueText}`;
          case 'labeled': return `labeled ${issueText}`;
          case 'unlabeled': return `unlabeled ${issueText}`;
          case 'edited': return `edited ${issueText}`;
          case 'milestoned': return `milestoned ${issueText}`;
          case 'demilestoned': return `demilestoned ${issueText}`;
          default: return `interacted with ${issueText}`;
        }
      case 'MemberEvent': return `added an user ${repositoryText && `to ${repositoryText}`}`;
      case 'PublicEvent': return `made ${repositoryText} public`;
      case 'PullRequestEvent':
        switch (payload.get('action')) {
          case 'assigned': return 'assigned a pr';
          case 'unassigned': return 'unassigned a pr';
          case 'labeled': return 'labeled a pr';
          case 'unlabeled': return 'unlabeled a pr';
          case 'opened': return 'opened a pr';
          case 'edited': return 'edited a pr';

          case 'closed':
            return payload.getIn(['pull_request', 'merged_at']) ? 'merged a pr' : 'closed a pr';

          case 'reopened': return 'reopened a pr';
          default: return 'interacted with a pr';
        }
      case 'PullRequestReviewEvent': return 'reviewed a pr';
      case 'PullRequestReviewCommentEvent':
        switch (payload.get('action')) {
          case 'created': return 'commented on a pr review';
          case 'edited': return 'edited a pr review';
          case 'deleted': return 'deleted a pr review';
          default: return 'interacted with a pr review';
        }
      case 'PushEvent':
        return (() => {
          const commits = payload.get('commits') || List([Map()]);
          // const commit = payload.get('head_commit') || commits[0];
          const count = max([1, payload.get('size'), payload.get('distinct_size'), commits.size]) || 1;
          const branch = (payload.get('ref') || '').split('/').pop();

          const pushedText = payload.get('forced') ? 'force pushed' : 'pushed';
          const commitText = count > 1 ? `${count} commits` : 'a commit';
          const branchText = branch === 'master' ? `to ${branch}` : '';

          return `${pushedText} ${commitText} ${branchText}`;
        })();
      case 'ReleaseEvent': return 'published a release';
      case 'WatchEvent': return `starred ${repositoryText}`;
      case 'WatchEvent:OneRepoMultipleUsers':
        return (() => {
          const otherUsers = payload.get('users');
          const otherUsersText = otherUsers && otherUsers.size > 0
            ? (otherUsers.size > 1 ? `and ${otherUsers.size} others` : 'and 1 other')
            : '';

          return `${otherUsersText} starred ${repositoryText}`;
        })();
      case 'WatchEvent:OneUserMultipleRepos':
        return (() => {
          const otherRepos = payload.get('repos');
          const count = (otherRepos && otherRepos.size) || 0;

          return count > 1 ? `starred ${count} repositories` : `starred ${repositoryText}`;
        })();
      default: return 'did something';
    }
  })();

  return text.replace(/ {2}/g, ' ').trim();
}

export function getOwnerAndRepo(repoFullName: string): { owner: ?string, repo: ?string} {
  const repoSplitedNames = (repoFullName || '').trim().split('/').filter(Boolean);

  const owner = (repoSplitedNames[0] || '').trim();
  const repo = (repoSplitedNames[1] || '').trim();

  return { owner, repo };
}

export function groupSimilarEvents(events: Array<GithubEvent>) {
  let hasMerged = false;

  const tryGroupEvents = (eventA: GithubEvent, eventB: GithubEvent) => {
    if (!eventA || !eventB) return null;

    const typeA: GithubEventType = eventA.get('type');
    const typeB: GithubEventType = eventB.get('type');

    const isSameRepo = eventA.getIn(['repo', 'id']) === eventB.getIn(['repo', 'id']);
    const isSameUser = eventA.getIn(['actor', 'id']) === eventB.getIn(['actor', 'id']);
    const createdAtMinutesDiff = moment(eventA.get('created_at')).diff(moment(eventB.get('created_at')), 'minutes');
    const merged = eventA.get('merged') || List();

    // only merge events that were created in the same hour
    if (createdAtMinutesDiff >= 24 * 60) return null;

    // only merge 5 items max
    if (merged.size >= 5 - 1) return null;

    switch (typeA) {
      case 'WatchEvent':
        return (() => {
          switch (typeB) {
            case 'WatchEvent':
              return (() => {
                if (isSameRepo) {
                  return eventA.mergeDeep(fromJS({
                    type: 'WatchEvent:OneRepoMultipleUsers',
                    payload: {
                      users: [eventB.get('actor')],
                    },
                  }));
                } else if (isSameUser) {
                  return eventA.mergeDeep(fromJS({
                    type: 'WatchEvent:OneUserMultipleRepos',
                    repo: null,
                    payload: {
                      repos: [eventA.get('repo'), eventB.get('repo')],
                    },
                  }));
                }

                return null;
              })();

            default:
              return null;
          }
        })();

      case 'WatchEvent:OneRepoMultipleUsers':
        return (() => {
          switch (typeB) {
            case 'WatchEvent':
              return (() => {
                if (isSameRepo) {
                  const users = eventA.getIn(['payload', 'users']) || List();
                  const newUser = eventB.getIn(['actor']);

                  const alreadyMergedThisUser = users.find(mergedUser => (
                    `${mergedUser.get('id')}` === `${newUser.get('id')}`
                  ));

                  if (!alreadyMergedThisUser) {
                    const newUsers = users.push(newUser);
                    return eventA.setIn(['payload', 'users'], newUsers);
                  }

                  return null;
                }

                return null;
              })();

            default:
              return null;
          }
        })();

      case 'WatchEvent:OneUserMultipleRepos':
        return (() => {
          switch (typeB) {
            case 'WatchEvent':
              return (() => {
                if (isSameUser) {
                  const repos = eventA.getIn(['payload', 'repos']) || List();
                  const newRepo = eventB.getIn(['repo']);

                  const alreadyMergedThisRepo = repos.find(mergedRepo => (
                    `${mergedRepo.get('id')}` === `${newRepo.get('id')}`
                  ));

                  if (!alreadyMergedThisRepo) {
                    const newRepos = repos.push(newRepo);
                    return eventA.setIn(['payload', 'repos'], newRepos);
                  }

                  return null;
                }

                return null;
              })();

            default:
              return null;
          }
        })();

      default: return null;
    }
  };

  const accumulator = (newEvents: Array<GithubEvent>, event: GithubEvent) => {
    const lastEvent = newEvents.last();
    const mergedLastEvent = tryGroupEvents(lastEvent, event);

    if (mergedLastEvent) {
      hasMerged = true;

      let allMergedEvents = mergedLastEvent.get('merged') || List();
      allMergedEvents = allMergedEvents.push(event);

      const mergedLastEventUpdated = mergedLastEvent.set('merged', allMergedEvents);
      return newEvents.set(-1, mergedLastEventUpdated);
    }

    return newEvents.push(event);
  };

  const newEvents = events.reduce(accumulator, List());
  return hasMerged ? newEvents : events;
}

export function groupNotificationsByRepository(
  notifications: Array<GithubNotification>,
  { includeAllGroup = false } : { includeAllGroup?: boolean } = {}
) {
  let groupedNotifications = includeAllGroup
    ? OrderedMap({
      'all': Map({
        id: 'all',
        notifications,
        title: 'notifications',
      })
    })
    : OrderedMap()
  ;

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

export function getCommentIdFromUrl(url: string) {
  if (!url) return null;

  const matches = url.match(/\/comments\/([0-9]+)([?].+)?$/);
  return (matches && matches[1]) || undefined;
}

export function getCommitShaFromUrl(url: string) {
  if (!url) return null;

  const matches = url.match(/\/commits\/([a-zA-Z0-9]+)([?].+)?$/);
  return (matches && matches[1]) || undefined;
}

export function getIssueOrPullRequestNumberFromUrl(url: string) {
  if (!url) return null;

  const matches = url.match(/\/(issues|pulls)\/([0-9]+)([?].+)?$/);
  const number = matches && matches[2];

  return parseInt(number) || number || undefined;
}

export function getOrgAvatar(orgName: string) {
  return orgName ? `https://github.com/${orgName}.png` : '';
}

export function getUserAvatar(userName: string) {
  return userName ? `https://github.com/${userName}.png` : '';
}

export function tryGetUsernameFromGithubEmail(email: string) {
  if (!email) return '';

  const emailSplit = email.split('@');
  if (emailSplit.length === 2 && emailSplit[1] === 'users.noreply.github.com') return emailSplit[0];

  return '';
}

export function getUserAvatarByEmail(email: string, { size, ...otherOptions }: { size?: number }) {
  const sizeSteps = 50; // sizes will be multiples of 50 for caching (e.g 50, 100, 150, ...)
  const steppedSize = !size ? sizeSteps : sizeSteps * Math.max(1, Math.ceil(size / sizeSteps));

  const username = tryGetUsernameFromGithubEmail(email);
  if (username) return getUserAvatar(username);

  const options = { size: steppedSize, d: 'retro', ...otherOptions };
  return `https:${gravatar.url(email, options)}`.replace('??', '?');
}

/* eslint-disable-next-line no-useless-escape */
export const getRepoFullNameFromUrl = (url: string): string => (
  url
      ? ((url.match(/(github.com\/(repos\/)?)([a-zA-Z0-9\-._]+\/[a-zA-Z0-9\-._]+[^\/#$]?)/i) || [])[3]) || ''
    : ''
);

export const getGitHubURLForUser = (user: string) => (
  user ? `${baseURL}/${user}` : ''
);

const objToQueryParams = obj => Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');

export const getGitHubSearchURL = (queryParams: Object) => (
  queryParams ? `${baseURL}/search?${objToQueryParams(queryParams)}` : ''
);

export const getGitHubURLForBranch = (repoFullName: string, branch: string) => (
  repoFullName && branch ? `${baseURL}/${repoFullName}/tree/${branch}` : ''
);

export function githubHTMLUrlFromAPIUrl(apiURL: string): string {
  if (!apiURL) return '';

  const [, type, restOfURL] = apiURL.match('api.github.com/([a-zA-Z]+)/(.*)');
  if (!(type && restOfURL)) return '';

  if (type === 'repos') {
    const repoFullName = getRepoFullNameFromUrl(apiURL);
    const [type2, ...restOfURL] = (apiURL.split(`/repos/${repoFullName}/`)[1] || '').split('/');

    if (restOfURL[0]) {
      switch (type2) {
        case 'pulls':
          if (restOfURL[1] === 'comments' && restOfURL[2]) {
            return `${baseURL}/${repoFullName}/pull/${restOfURL[0]}#discussion_r${restOfURL[2]}`;
          }

          return `${baseURL}/${repoFullName}/pull/${restOfURL[0]}`;

        case 'issues':
          if (restOfURL[1] === 'comments' && restOfURL[2]) {
            return `${baseURL}/${repoFullName}/pull/${restOfURL[0]}#issuecomment-${restOfURL[2]}`;
          }

          return `${baseURL}/${repoFullName}/issues/${restOfURL[0]}`;

        case 'commits':
          return `${baseURL}/${repoFullName}/commit/${restOfURL[0]}`;
      }
    }
  }

  return `${baseURL}/${restOfURL}`;
}

function openURL(url: string) {
  if (!url) return null;

  // sometimes the url come like this: '/facebook/react', so we add https://github.com
  let _url = url[0] === '/' && url.indexOf('github.com') < 0 ? `${baseURL}${url}` : url;

  // replace http with devhub:// so the app deeplinking will handle this
  // the app will decide if it will push an app screen or open the web browser
  _url = _url.replace(/(http[s]?)/, 'devhub');

  return Linking.openURL(_url);
}

export function openOnGithub(obj: string | GithubRepo | GithubIssue | GithubPullRequest) {
  if (!obj) return null;

  if (typeof obj === 'string') {
    return openURL(obj);
  }

  const url = obj.get('html_url') || obj.get('url');
  if (!url) return null;

  return openURL(internalUrl);
}
