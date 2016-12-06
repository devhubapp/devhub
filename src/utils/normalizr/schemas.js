import { arrayOf, Schema } from 'normalizr';

// import type { Issue, Org, PullRequest, Repo, User } from '../../utils/types';

const idAttribute = (obj: { id: number | string }): string => obj.id.toString().toLowerCase();

// /* eslint-disable no-useless-escape */
// const getRepoFullNameFromUrl = (url: string): string => (
//   (url.match(/(?:github.com\/repos\/)([a-zA-Z0-9\-\.\_]+\/[a-zA-Z0-9-\-\.\_]+[^\/]?)/i) || [])[1] || ''
// );
// /* eslint-enable no-useless-escape */

export const CommentSchema = new Schema('comments', { idAttribute });

export const ColumnSchema = new Schema('columns', { idAttribute });

export const EventSchema = new Schema('events', { idAttribute });

export const IssueSchema = new Schema('issues', {
  idAttribute,
  // idAttribute: (issue: Issue) => {
  //   const repoFullName = getRepoFullNameFromUrl(issue.repository_url);
  //   return repoFullName ? `${repoFullName}#${issue.number}` : idAttribute(issue);
  // },
});

export const OrgSchema = new Schema('orgs', {
  idAttribute,
  // idAttribute: (org: Org) => org.login.toLowerCase() || idAttribute(org),
});

export const PullRequestSchema = new Schema('pullRequests', {
  idAttribute,
  // idAttribute: (pullRequest: PullRequest) => {
  //   const repoFullName = getRepoFullNameFromUrl(pullRequest.url).toLowerCase();
  //   return repoFullName ? `${repoFullName}#${pullRequest.number}` : idAttribute(pullRequest);
  // },
});

export const SubscriptionSchema = new Schema('subscriptions');

export const UserSchema = new Schema('users', {
  // idAttribute,
  // idAttribute: (user: User) => user.login.toLowerCase() || idAttribute(user),
});

export const RepoSchema = new Schema('repos', {
  idAttribute,
  // idAttribute: (repo: Repo) => (repo.full_name || repo.name).toLowerCase() || idAttribute(repo),
});

CommentSchema.define({
  user: UserSchema,
});

ColumnSchema.define({
  events: arrayOf(EventSchema),
  subscriptions: arrayOf(SubscriptionSchema),
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
  ColumnSchema,
  EventSchema,
  IssueSchema,
  OrgSchema,
  PullRequestSchema,
  UserSchema,
  RepoSchema,
  SubscriptionSchema,
};
