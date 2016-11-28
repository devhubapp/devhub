import { arrayOf, Schema } from 'normalizr';

import type { Issue, Org, PullRequest, Repo, User } from '../../utils/types';

const idAttribute = (obj: { id: number | string }): string => obj.id.toString().toLowerCase();

const getRepoFullNameFromUrl = (url: string): string => (
  (url.match(/(?:github.com\/repos\/)([a-zA-Z0-9\-\.\_]+\/[a-zA-Z0-9-\-\.\_]+[^\/]?)/i) || [])[1] || ''
);

export const CommentSchema = new Schema('comments', { idAttribute });

export const EventSchema = new Schema('events', { idAttribute });

export const IssueSchema = new Schema('issues', {
  idAttribute: (issue: Issue) => {
    const repoFullName = getRepoFullNameFromUrl(issue.repository_url);
    return repoFullName ? `${repoFullName}#${issue.number}` : idAttribute(issue);
  },
});

export const OrgSchema = new Schema('orgs', {
  idAttribute: (org: Org) => org.login.toLowerCase() || idAttribute(org),
});

export const PullRequestSchema = new Schema('pullRequests', {
  idAttribute: (pullRequest: PullRequest) => {
    const repoFullName = getRepoFullNameFromUrl(pullRequest.url).toLowerCase();
    return repoFullName ? `${repoFullName}#${pullRequest.number}` : idAttribute(pullRequest);
  },
});

export const UserSchema = new Schema('users', {
  idAttribute: (user: User) => user.login.toLowerCase() || idAttribute(user),
});

export const RepoSchema = new Schema('repos', {
  idAttribute: (repo: Repo) => (repo.full_name || repo.name).toLowerCase() || idAttribute(repo),
});

CommentSchema.define({
  user: UserSchema,
});

EventSchema.define({
  actor: UserSchema,
  org: OrgSchema,
  repo: RepoSchema,
  payload: {
    repo: RepoSchema,
    user: UserSchema,
    issue: IssueSchema,
    pull_request: PullRequestSchema,
  },
});

IssueSchema.define({
  user: UserSchema,
  assignee: UserSchema,
  assignees: arrayOf(UserSchema),
});

PullRequestSchema.define({
  user: UserSchema,
  assignee: UserSchema,
  assignees: arrayOf(UserSchema),
  merged_by: UserSchema,
});

export default {
  CommentSchema,
  EventSchema,
  IssueSchema,
  OrgSchema,
  PullRequestSchema,
  UserSchema,
  RepoSchema,
};
