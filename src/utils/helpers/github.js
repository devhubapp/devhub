// @flow
/* eslint-disable import/prefer-default-export */

import type { GithubEvent, GithubIcon } from '../types/github';

type GithubEventPayload = {
  action?: string,
  ref_type?: string,
};

export function getEventIcon(event: GithubEvent, payload: GithubEventPayload = {}): GithubIcon {
  switch (event) {
    case 'CommitCommentEvent': return 'comment-discussion'; // git-commit
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
    case 'GollumEvent': return 'book';
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
    case 'PullRequestEvent': return 'git-pull-request';
    case 'PullRequestReviewEvent':
    case 'PullRequestReviewCommentEvent': return 'comment-discussion';
    case 'PushEvent': return payload.forced ? 'repo-force-push' : 'repo-push'; // git-commit
    case 'ReleaseEvent': return 'tag';
    case 'WatchEvent': return 'star';
    default: return 'mark-github';
  }
}

export function getEventText(event: GithubEvent, payload: GithubEventPayload = {}): GithubIcon {
  switch (event) {
    case 'CommitCommentEvent': return 'commented on a commit';
    case 'CreateEvent':
      switch(payload.ref_type) {
        case 'repository': return 'created a repository';
        case 'branch': return 'created a branch';
        case 'tag': return 'created a tag';
        default: return 'created something';
      }
    case 'DeleteEvent':
      switch(payload.ref_type) {
        case 'repository': return 'deleted a repository';
        case 'branch': return 'deleted a branch';
        case 'tag': return 'deleted a tag';
        default: return 'deleted something';
      }
    case 'GollumEvent': return 'updated the wiki';
    case 'ForkEvent': return 'forked a repository';
    case 'IssueCommentEvent': return 'commented on an issue';
    case 'IssuesEvent': // TODO: Fix these texts
      switch(payload.action) {
        case 'closed': return 'closed an issue';
        case 'reopened': return 'reopened an issue';
        case 'opened': return 'opened an issue';
        case 'assigned': return 'assigned an issue';
        case 'unassigned': return 'unassigned an issue';
        case 'labeled': return 'labeled an issue';
        case 'unlabeled': return 'unlabeled an issue';
        case 'edited': return 'edited an issue';
        case 'milestoned': return 'milestoned an issue';
        case 'demilestoned': return 'demilestoned an issue';
        default: return 'interacted with an issue';
      }
    case 'MemberEvent': return 'was added to a repository';
    case 'PublicEvent': return 'made a repository public';
    case 'PullRequestEvent':
      switch(payload.action) {
        case 'assigned': return 'assigned a pull request';
        case 'unassigned': return 'unassigned a pull request';
        case 'labeled': return 'labeled a pull request';
        case 'unlabeled': return 'unlabeled a pull request';
        case 'opened': return 'opened a pull request';
        case 'edited': return 'edited a pull request';
        case 'closed': return 'closed a pull request';
        case 'reopened': return 'reopened a pull request';
        default: return 'interacted with a pull request';
      }
    case 'PullRequestReviewEvent': return 'reviewed a pull request';
    case 'PullRequestReviewCommentEvent':
      switch(payload.action) {
        case 'created': return 'commented on a pull request review';
        case 'edited': return 'edited a pull request review';
        case 'deleted': return 'deleted a pull request review';
        default: return 'interacted with a pull request review';
      }
    case 'PushEvent':
      const commits = payload.commits || [{}];
      const commit = payload.head_commit || commits[0];
      const count = payload.distinct_size || payload.size || commits.length || 1;

      const pushedText = payload.forced ? 'force pushed' : 'pushed';
      const commitText = count === 1 ? 'a commit' : (count > 1 ? `${count} commits` : 'commits');
      return `${pushedText} ${commitText}`;
    case 'ReleaseEvent': return 'published a release';
    case 'WatchEvent': return 'starred a repository';
    default: return 'did something';
  }
}
