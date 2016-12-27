import { arrayOf, Schema } from 'normalizr';

const idAttribute = (obj: { id: number | string }): string => obj.id.toString().toLowerCase();

export const CommentSchema = new Schema('comments', { idAttribute });
export const ColumnSchema = new Schema('columns', { idAttribute });
export const EventSchema = new Schema('events', { idAttribute });
export const IssueSchema = new Schema('issues', { idAttribute });
export const OrgSchema = new Schema('orgs', { idAttribute });
export const NotificationSchema = new Schema('notifications', { idAttribute });
export const PullRequestSchema = new Schema('pullRequests', { idAttribute });
export const SubscriptionSchema = new Schema('subscriptions');
export const UserSchema = new Schema('users', { idAttribute });
export const RepoSchema = new Schema('repos', { idAttribute });

CommentSchema.define({
  user: UserSchema,
});

ColumnSchema.define({
  subscriptions: arrayOf(SubscriptionSchema),
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
  merged: arrayOf(EventSchema),
});

IssueSchema.define({
  user: UserSchema,
  assignee: UserSchema,
  assignees: arrayOf(UserSchema),
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
  assignees: arrayOf(UserSchema),
  merged_by: UserSchema,
});

SubscriptionSchema.define({
  events: arrayOf(EventSchema),
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
