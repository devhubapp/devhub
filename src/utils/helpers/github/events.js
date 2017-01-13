// @flow
/* eslint-disable import/prefer-default-export */

import moment from 'moment';
import { max } from 'lodash';
import { fromJS, List, Map, Set } from 'immutable';

import { isArchivedFilter, isReadFilter } from '../../../selectors';
import { getIssueIconAndColor, getPullRequestIconAndColor } from './shared';
import * as baseTheme from '../../../styles/themes/base';

import type {
    GithubEvent,
    GithubEventType,
    GithubIcon,
    ThemeObject,
  } from '../../types';

export function getEventIconAndColor(event: GithubEvent, theme?: ThemeObject = baseTheme):
{ icon: GithubIcon, color?: string } {
  const eventType = event.get('type').split(':')[0];
  const payload = event.get('payload');

  switch (eventType) {
    case 'CommitCommentEvent': return { icon: 'git-commit', subIcon: 'comment-discussion' };
    case 'CreateEvent':
      switch (payload.get('ref_type')) {
        case 'repository': return { icon: 'repo' };
        case 'branch': return { icon: 'git-branch' };
        case 'tag': return { icon: 'tag' };
        default: return { icon: 'plus' };
      }
    case 'DeleteEvent':
      switch (payload.get('ref_type')) {
        case 'repository': return { icon: 'repo', subIcon: 'trashcan', subIconColor: theme.red };
        case 'branch': return { icon: 'git-branch', subIcon: 'trashcan', subIconColor: theme.red };
        case 'tag': return { icon: 'tag', subIcon: 'trashcan', subIconColor: theme.red };
        default: return { icon: 'trashcan' };
      }
    case 'GollumEvent': return { icon: 'book' };
    case 'ForkEvent': return { icon: 'repo-forked' };

    case 'IssueCommentEvent':
      return {
        ...(
          // can be an issue or pull request sometimes due to github bug
          payload.get('pull_request') || payload.getIn(['issue', 'merged_at'])
          ? getPullRequestIconAndColor(payload.get('pull_request') || payload.get('issue'), theme)
          : getIssueIconAndColor(payload.get('issue'), theme)
        ),
        subIcon: 'comment-discussion',
      };

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
    case 'PullRequestReviewCommentEvent':
      return {
        ...getPullRequestIconAndColor(payload.get('pull_request'), theme),
        subIcon: 'comment-discussion',
      };

    case 'PushEvent': return { icon: 'code' };
    case 'ReleaseEvent': return { icon: 'tag' };
    case 'WatchEvent': return { icon: 'star', color: theme.star };
    default: return { icon: 'mark-github' };
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

export function groupSimilarEvents(events: Array<GithubEvent>) {
  let hasMerged = false;

  const tryGroupEvents = (eventA: GithubEvent, eventB: GithubEvent) => {
    if (!eventA || !eventB) return null;

    const typeA: GithubEventType = eventA.get('type');
    const typeB: GithubEventType = eventB.get('type');

    const isSameRepo = eventA.getIn(['repo', 'id']) === eventB.getIn(['repo', 'id']);
    const isSameUser = eventA.getIn(['actor', 'id']) === eventB.getIn(['actor', 'id']);
    const isSameArchiveStatus = isArchivedFilter(eventA) === isArchivedFilter(eventB);
    const isSameReadStatus = isReadFilter(eventA) === isReadFilter(eventB);
    const createdAtMinutesDiff = moment(eventA.get('created_at')).diff(moment(eventB.get('created_at')), 'minutes');
    const merged = eventA.get('merged') || List();

    // only merge events with same archive and read status
    if (!(isSameArchiveStatus && isSameReadStatus)) return null;

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

export function getEventIdsFromEventIncludingMerged(event) {
  if (!event) return Set([]);

  let eventIds = Set([event.get('id')]);
  const merged = event.get('merged');

  if (merged) {
    merged.forEach(mergedEvent => {
      eventIds = eventIds.add(mergedEvent.get('id'));
    });
  }

  return eventIds;
}

export function getEventIdsFromEventsIncludingMerged(events) {
  let eventIds = Set([]);
  if (!events) return eventIds;

  events.forEach(event => {
    eventIds = eventIds.concat(getEventIdsFromEventIncludingMerged(event));
  });

  return eventIds;
}
