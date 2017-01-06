import pick from 'lodash/pick';
import { schema } from 'normalizr';

import {
  commitIdAttribute,
  issueOrPullRequestIdAttribute,
  notificationProcessStrategy,
  preferNewestMergeStrategy,
  simpleIdAttribute,
} from './helpers';

const defaultOptions = { idAttribute: simpleIdAttribute, mergeStrategy: preferNewestMergeStrategy };

const defaultFields = ['id', 'html_url', 'url', 'created_at', 'updated_at'];

const issueOrPullRequestFields = [
  ...defaultFields,
  'number',
  'latest_comment_url',
  'state',
  'title',
  'repository_url',
  'type', // because of the subject field of type Union on notifications
];

const ownerFields = [...defaultFields, 'avatar_url', 'display_login', 'login'];

export const CommentSchema = new schema.Entity('comments', {}, {
  ...defaultOptions,
  processStrategy: obj => pick(obj, [...defaultFields, 'body', 'user']),
});

export const CommitsSchema = new schema.Entity('commits', {}, {
  ...defaultOptions,
  idAttribute: commitIdAttribute,
});

export const ColumnSchema = new schema.Entity('columns', {}, defaultOptions);
export const EventSchema = new schema.Entity('events', {}, defaultOptions);

export const IssueSchema = new schema.Entity('issues', {}, {
  ...defaultOptions,
  idAttribute: issueOrPullRequestIdAttribute,
  processStrategy: obj => pick(obj, issueOrPullRequestFields),
});

export const NotificationSchema = new schema.Entity('notifications', {}, {
  ...defaultOptions,
  processStrategy: (obj) => notificationProcessStrategy(obj),
});

export const OrgSchema = new schema.Entity('orgs', {}, {
  ...defaultOptions,
  processStrategy: obj => pick(obj, ownerFields),
});

export const PullRequestSchema = new schema.Entity('pullRequests', {}, {
  ...defaultOptions,
  idAttribute: issueOrPullRequestIdAttribute,
  processStrategy: obj => pick(obj, [...issueOrPullRequestFields, 'merged_at']),
});

export const SubscriptionSchema = new schema.Entity('subscriptions', {}, defaultOptions);

export const UserSchema = new schema.Entity('users', {}, {
  ...defaultOptions,
  processStrategy: obj => pick(obj, ownerFields),
});

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
    forkee: RepoSchema,
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
