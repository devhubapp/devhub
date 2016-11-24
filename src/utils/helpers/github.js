// @flow
/* eslint-disable import/prefer-default-export */

import type { GithubEvent, GithubIcon } from '../types/github';

type GithubEventPayload = {
  action?: string,
  ref_type?: string,
};

export function getEventIcon(event: GithubEvent, payload: GithubEventPayload = {}): GithubIcon {
  switch (event) {
    case 'CommitCommentEvent': return 'git-commit';
    case 'CreateEvent':
      switch(payload.ref_type) {
        case 'repository': return 'repo';
        case 'branch': return 'git-branch';
        case 'tag': return 'tag';
        default: return 'plus';
      }
    case 'DeleteEvent':
      switch(payload.ref_type) {
        case 'repository': return 'repo'; // probably not used
        case 'branch': return 'git-branch';
        case 'tag': return 'tag';
        default: return 'trashcan';
      }
    case 'ForkEvent': return 'repo-forked';
    case 'IssueCommentEvent': return 'comment-discussion';
    case 'IssuesEvent':
      switch(payload.action) {
        case 'closed': return 'issue-closed';
        case 'reopened': return 'issue-reopened';
        // case 'opened':
        // case 'assigned':
        // case 'unassigned':
        // case 'labeled':
        // case 'unlabeled':
        // case 'edited':
        // case 'milestoned':
        // case 'demilestoned':
        default: return 'issue-opened';
      }
    case 'MemberEvent': return 'person';
    case 'PublicEvent': return 'repo';
    case 'WatchEvent': return 'star';
    default: return 'mark-github';
  }
}
