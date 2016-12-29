import { schema } from 'normalizr';

const idAttribute = (obj: { id: number | string }): string => obj.id.toString().toLowerCase();

export const CommentSchema = new schema.Entity('comments', { idAttribute });
export const ColumnSchema = new schema.Entity('columns', { idAttribute });
export const EventSchema = new schema.Entity('events', { idAttribute });
export const IssueSchema = new schema.Entity('issues', { idAttribute });
export const OrgSchema = new schema.Entity('orgs', { idAttribute });
export const NotificationSchema = new schema.Entity('notifications', { idAttribute });
export const PullRequestSchema = new schema.Entity('pullRequests', { idAttribute });
export const SubscriptionSchema = new schema.Entity('subscriptions', { idAttribute });
export const UserSchema = new schema.Entity('users', { idAttribute });
export const RepoSchema = new schema.Entity('repos', { idAttribute });

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
