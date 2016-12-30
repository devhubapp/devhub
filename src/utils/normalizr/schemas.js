import { schema } from 'normalizr';

import {
  commitIdAttribute,
  issueOrPullRequestIdAttribute,
  notificationProcessStrategy,
  preferNewestMergeStrategy,
  simpleIdAttribute,
} from './helpers';

const defaultOptions = { idAttribute: simpleIdAttribute, mergeStrategy: preferNewestMergeStrategy };

export const CommentSchema = new schema.Entity('comments', {}, defaultOptions);

export const CommitsSchema = new schema.Entity('commits', {}, {
  ...defaultOptions,
  idAttribute: commitIdAttribute,
});

export const ColumnSchema = new schema.Entity('columns', {}, defaultOptions);
export const EventSchema = new schema.Entity('events', {}, defaultOptions);

export const IssueSchema = new schema.Entity('issues', {}, {
  ...defaultOptions,
  idAttribute: issueOrPullRequestIdAttribute,
});

export const OrgSchema = new schema.Entity('orgs', {}, defaultOptions);

export const NotificationSchema = new schema.Entity('notifications', {}, {
  ...defaultOptions,
  processStrategy: notificationProcessStrategy,
});

export const PullRequestSchema = new schema.Entity('pullRequests', {}, {
  ...defaultOptions,
  idAttribute: issueOrPullRequestIdAttribute,
});

export const SubscriptionSchema = new schema.Entity('subscriptions', {}, defaultOptions);
export const UserSchema = new schema.Entity('users', {}, defaultOptions);
export const RepoSchema = new schema.Entity('repos', {}, defaultOptions);

CommentSchema.define({
  user: UserSchema,
});

ColumnSchema.define({
  subscriptions: [SubscriptionSchema],
});

EventSchema.define({
  actor: UserSchema,
  org: OrgSchema,
  repo: RepoSchema,
  payload: {
    comment: CommentSchema,
    commits: [CommitsSchema],
    issue: IssueSchema,
    pull_request: PullRequestSchema,
    repo: RepoSchema,
    user: UserSchema,
  },
  merged: [EventSchema],
});

IssueSchema.define({
  user: UserSchema,
  assignee: UserSchema,
  assignees: [UserSchema],
});

NotificationSchema.define({
  comment: CommentSchema,
  repository: RepoSchema,
  subject: new schema.Union({
    Commit: CommitsSchema,
    Issue: IssueSchema,
    PullRequest: PullRequestSchema,
  }, 'type'),
});

PullRequestSchema.define({
  user: UserSchema,
  assignee: UserSchema,
  assignees: [UserSchema],
  merged_by: UserSchema,
});

SubscriptionSchema.define({
  events: [EventSchema],
});
