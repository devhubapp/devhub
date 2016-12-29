import moment from 'moment';
import { schema } from 'normalizr';

const idAttribute = (obj: { id: number | string }): string => obj.id.toString().toLowerCase();
const mergeStrategy = (entityA, entityB) => {
  if (entityA.updated_at && entityB.updated_at) {
    const dateA = new Date(entityA.updated_at);
    const dateB = new Date(entityA.updated_at);

    return moment(dateA).isAfter(dateB) ? { ...entityA, ...entityB } : { ...entityB, ...entityA };
  }

  return {
    ...entityB,
    ...entityA,
  };
};

const defaultOptions = { idAttribute, mergeStrategy };

export const CommentSchema = new schema.Entity('comments', {}, defaultOptions);
export const ColumnSchema = new schema.Entity('columns', {}, defaultOptions);
export const EventSchema = new schema.Entity('events', {}, defaultOptions);
export const IssueSchema = new schema.Entity('issues', {}, defaultOptions);
export const OrgSchema = new schema.Entity('orgs', {}, defaultOptions);
export const NotificationSchema = new schema.Entity('notifications', {}, defaultOptions);
export const PullRequestSchema = new schema.Entity('pullRequests', {}, defaultOptions);
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
  // issue: IssueSchema,
  // pull_request: PullRequestSchema,
  repository: RepoSchema,
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
