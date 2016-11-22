// @flow
/* eslint-disable import/prefer-default-export */

import type { GithubEvent, GithubIcon } from '../types/github';

export function getEventIcon(event: GithubEvent, ref_type: string): GithubIcon {
  switch (event) {
    case 'CommitCommentEvent': return 'git-commit';
    case 'CreateEvent':
      switch(ref_type) {
        case 'repository': return 'repo';
        case 'branch': return 'git-branch';
        case 'tag': return 'tag';
        default: return 'plus';
      }
    case 'DeleteEvent':
      switch(ref_type) {
        case 'repository': return 'repo'; // probably not used
        case 'branch': return 'git-branch';
        case 'tag': return 'tag';
        default: return 'trashcan';
      }
    case 'ForkEvent': return 'repo-forked';
    case 'IssueCommentEvent': return 'comment-discussion';
    case 'IssuesEvent':
      switch(ref_type) {
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
