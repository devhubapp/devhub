/**
 * @flow
 * https://developer.github.com/v3/activity/events/types/#watchevent
 */

export type GithubUser = {
  id: number | string,
  login: string,
  display_login?: string,
  avatar_url: string,
  html_url?: string, // https://github.com/brunolemos

  // api
  url?: string, // https://api.github.com/users/brunolemos
  followers_url?: string, // https://api.github.com/users/richelbilderbeek/followers
  following_url?: string, // https://api.github.com/users/richelbilderbeek/following{/other_user}
  gists_url?: string, // https://api.github.com/users/richelbilderbeek/gists{/gist_id}
  starred_url?: string, // https://api.github.com/users/richelbilderbeek/starred{/owner}{/repo}
  subscriptions_url?: string, // https://api.github.com/users/richelbilderbeek/subscriptions
  organizations_url?: string, // https://api.github.com/users/richelbilderbeek/orgs
  repos_url?: string, // https://api.github.com/users/richelbilderbeek/repos
  events_url?: string, // https://api.github.com/users/richelbilderbeek/events{/privacy}
  received_events_url?: string, // https://api.github.com/users/richelbilderbeek/received_events
};

export type GithubReaction = {
  total_count: number,
  '+1': number,
  '-1': number,
  laugh: number,
  confused: number,
  heart: number,
  hooray: number,

  // api
  url: string, // 'https://api.github.com/repos/octocat/Hello-World/comments/1/reactions'
};

export type GithubComment = {
  id: string,
  commit_id: string, // 6ef64f902613c73251da32d1bc9eb236f38798cc
  user: GithubUser,
  body: string,
  position?: ?number,
  line?: ?number,
  path?: ?number,
  reactions?: Array<GithubReaction>,
  created_at: string, // 2016-11-24T16:00:16Z
  updated_at: string, // 2016-11-24T16:00:16Z
  html_url: string, // https://github.com/richelbilderbeek/pbdmms/commit/6ef64f902613c73251da32d1bc9eb236f38798cc#commitcomment-19954756
  url: string, // https://api.github.com/repos/richelbilderbeek/pbdmms/comments/19954756
};

export type GithubCommit = {
  sha: string,
  message: string,
  author: {
    name: string,
    email: string,
  },
  url: string,
  distinct: boolean, // Whether this commit is distinct from any that have been pushed before.
  forced: boolean,
}

export type GithubLabel = {
  id: number,
  url: string, // "https://api.github.com/repos/hasadna/Open-Knesset/labels/4%20-%20Prioritized",
  name: string,
  color: string, // CCCCCC
  'default': boolean,
  url: string, // https://api.github.com/repos/richelbilderbeek/pbdmms/comments/19954756
};

export type GithubMilestone = {
  id: number, // 1165557
  number: number, // 5
  title: string, // 30
  description: string, // Knesset 30 - future issues / will be fixed later
  creator: GithubUser,
  open_issues: number, // 17
  closed_issues: number, // 1
  state: 'open' | 'closed', // open
  created_at: string, // 2015-06-15T18:46:59Z
  updated_at: string, // 2016-05-23T18:01:44Z
  due_on: string, // 2035-04-30T21:00:00Z
  closed_at: ?string, // null

  html_url: string, // https://github.com/hasadna/Open-Knesset/milestones/30
  url: string, // https://api.github.com/repos/hasadna/Open-Knesset/milestones/5
  labels_url: string, // https://api.github.com/repos/hasadna/Open-Knesset/milestones/5/labels
};

export type GithubIssue = {
  id: string,
  user: GithubUser,
  assignee: GithubUser,
  assignees: Array<GithubUser>,
  number: number,
  body: string,
  title: string,
  labels: Array<GithubLabel>,
  state: 'open' | 'closed',
  locked: boolean,
  milestone: GithubMilestone,
  comments: number,
  created_at: string, // 2016-11-24T16:00:16Z
  updated_at: string, // 2016-11-24T16:00:16Z

  html_url: string, // https://github.com/hasadna/Open-Knesset/issues/345
  url: string, // https://api.github.com/repos/hasadna/Open-Knesset/issues/345
  repository_url: string, // https://api.github.com/repos/hasadna/Open-Knesset
  labels_url: string, // https://api.github.com/repos/hasadna/Open-Knesset/issues/345/labels{/name}
  comments_url: string, // https://api.github.com/repos/hasadna/Open-Knesset/issues/345/comments
  events_url: string, // https://api.github.com/repos/hasadna/Open-Knesset/issues/345/events
};

export type GithubOrg = {
  id: number | string,
  login: string,
  avatar_url: string,

  // api
  url: string, // https://api.github.com/orgs/DefinitelyTyped
};

export type GithubPullRequest = {
  id: number, // 95201658
  number: number, // 2
  state: 'open' | 'closed', // closed
  locked: boolean, // false
  title: string, // ok
  user: GithubUser,
  body: string, //
  created_at: string, // 2016-11-24T15:59:50Z
  updated_at: string, // 2016-11-24T16:00:02Z
  closed_at: ?string, // 2016-11-24T16:00:02Z
  merged_at: ?string, // 2016-11-24T16:00:02Z
  merge_commit_sha: ?string, // e94fd3c0ed8b1fe095acad353ef27c43dfd7ce9b
  assignee: ?GithubUser, // null
  assignees: ?Array<GithubUser>, // []
  milestone: ?GithubMilestone, // null
  head: Object, // Object
  base: Object, // Object
  _links: {
    [key: string]: {
      href: string,
    },
  },
  merged: boolean, // true
  mergeable: boolean, // null
  mergeable_state: string, // unknown
  merged_by: GithubUser, // User
  comments: number, // 0
  review_comments: number, // 0
  commits: number, // 2
  additions: number, // 4
  deletions: number, // 4
  changed_files: number, // 1

  html_url: string, // https://github.com/billy0920/hotsite/pull/2
  url: string, // https://api.github.com/repos/billy0920/hotsite/pulls/2
  diff_url: string, // https://github.com/billy0920/hotsite/pull/2.diff
  patch_url: string, // https://github.com/billy0920/hotsite/pull/2.patch
  issue_url: string, // https://api.github.com/repos/billy0920/hotsite/issues/2
  commits_url: string, // https://api.github.com/repos/billy0920/hotsite/pulls/2/commits
  review_comments_url: string, // https://api.github.com/repos/billy0920/hotsite/pulls/2/comments
  review_comment_url: string, // https://api.github.com/repos/billy0920/hotsite/pulls/comments{/number}
  comments_url: string, // https://api.github.com/repos/billy0920/hotsite/issues/2/comments
  statuses_url: string, // https://api.github.com/repos/billy0920/hotsite/statuses/b8c4838ea4fd5a0153d422ef5c158493fd57254d
};

export type GithubRepo = {
  id: number | string,
  name: string,
  full_name?: string,

  // api
  url: string, // https://api.github.com/repos/facebook/react
};

/**
 * Triggered when a commit comment is created.
 * https://developer.github.com/v3/repos/comments/#list-commit-comments-for-a-repository
 */
export type GithubCommitCommentEvent = {
  id: string,
  type: 'CommitCommentEvent',
  actor: GithubUser,
  org?: GithubOrg,
  repo: GithubRepo,
  payload: {
    comment: GithubComment,
  },
  'public': Boolean,
  created_at: string,
};

/**
 * Represents a created repository, branch, or tag.
 * Note: webhooks will not receive this event for created repositories.
 * Additionally, webhooks will not receive this event for tags
 * if more than three tags are pushed at once.
 */
export type CreateEvent = {
  id: string,
  type: 'CreateEvent',
  actor: GithubUser,
  org?: GithubOrg,
  repo: GithubRepo,
  payload: {
    ref: ?string, // The git ref (or null if only a repository was created).
    ref_type: 'repository' | 'branch' | 'tag', // The object that was created.
    master_branch: string, // The name of the repository's default branch (usually master).
    description: string, // The reposit ory's current description.
    pusher_type: 'user' | string,
  },
  'public': Boolean,
  created_at: string,
};

/**
 * Represents a deleted branch or tag.
 * Note: webhooks will not receive this event for tags if more than three tags are deleted at once.
 */
export type DeleteEvent = {
  id: string,
  type: 'CreateEvent',
  actor: GithubUser,
  org?: GithubOrg,
  repo: GithubRepo,
  payload: {
    ref: string, // The full git ref.
    ref_type: 'branch' | 'tag', // The object that was deleted.
    pusher_type: 'user' | string,
  },
  'public': Boolean,
  created_at: string,
};

/**
 * Triggered when a user forks a repository.
 * https://developer.github.com/v3/repos/forks/#create-a-fork
 */
export type ForkEvent = {
  forkee: Object, // The created repository.
};

/**
 * Triggered when a Wiki page is created or updated.
 */
export type GollumEvent = {
  pages: Array<Object>,
};

/**
 * Triggered when an issue comment is created, edited, or deleted.
 * https://developer.github.com/v3/issues/comments/
 */
export type IssueCommentEvent = {
  action: 'created' | 'edited' | 'deleted',
  issue: Object, // The issue the comment belongs to.
  comment: Object, // The comment itself.
  changes: Object, // The changes to the comment if the action was 'edited'.
};

/**
 * Triggered when an issue is assigned, unassigned, labeled, unlabeled,
 * opened, edited, milestoned, demilestoned, closed, or reopened.
 * https://developer.github.com/v3/issues
 */
export type IssuesEvent = {
  action:
    'assigned'
    | 'unassigned'
    | 'labeled'
    | 'unlabeled'
    | 'opened'
    | 'edited'
    | 'milestoned'
    | 'demilestoned'
    | 'closed'
    | 'reopened'
  ,
  issue: Object, // The issue itself.
  changes: Object, // The changes to the issue if the action was 'edited'.
  assignee?: Object, // The optional user who was assigned or unassigned from the issue.
  label?: Object, // The optional label that was added or removed from the issue.
};

/**
 * Triggered when a user is added as a collaborator to a repository.
 * https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator
 */
export type MemberEvent = {
  action: 'added', // The action that was performed.
  member: Object, // The user that was added.
};

/**
 * Triggered when a private repository is open sourced.
 * https://developer.github.com/v3/repos/#edit
 */
export type PublicEvent = {
};

/**
 * Triggered when a pull request is assigned, unassigned,
 * labeled, unlabeled, opened, edited, closed, reopened, or synchronized.
 * https://developer.github.com/v3/pulls
 *
 * If the action is 'closed' and the merged key is false,
 * the pull request was closed with unmerged commits.
 *
 * If the action is 'closed' and the merged key is true,
 * the pull request was merged.
 *
 * While webhooks are also triggered when a pull request is synchronized,
 * Events API timelines don't include pull request events with the 'synchronize' action.
 */
export type PullRequestEvent = {
  action:
    'assigned'
    | 'unassigned'
    | 'labeled'
    | 'unlabeled'
    | 'opened'
    | 'edited'
    | 'closed'
    | 'reopened'
  ,
  number: number,
  pull_request: GithubPullRequest,
  sender: Object,
};

/**
 * Triggered when a pull request review is submitted into a non-pending state.
 */
export type PullRequestReviewEvent = {
  action: 'submitted',
  pull_request: GithubPullRequest,
  review: Object,
};

/**
 * Triggered when a comment on a Pull Request's unified diff is created,
 * edited, or deleted (in the Files Changed tab).
 * https://developer.github.com/v3/pulls/comments
 */
export type PullRequestReviewCommentEvent = {
  action: 'created' | 'edited' | 'deleted',
  changes: Object,
  pull_request: GithubPullRequest,
  comment: Object,
};

/**
 * Triggered when a repository branch is pushed to.
 * In addition to branch pushes, webhook push events
 * are also triggered when repository tags are pushed.
 */
export type PushEvent = {
  ref: string, // The full Git ref that was pushed. Example: 'refs/heads/master'.
  head: string, // The SHA of the most recent commit on ref after the push.
  before: string, // The SHA of the most recent commit on ref before the push.
  size: number, // The number of commits in the push.
  distinct_size: number, // The number of distinct commits in the push.
  commits: Array<GithubCommit>,
};

/**
 * Triggered when a release is published.
 * https://developer.github.com/v3/repos/releases/#get-a-single-release
 */
export type ReleaseEvent = {
  action: 'published',
  release: Object, // https://developer.github.com/v3/repos/releases/#get-a-single-release
};

/**
 * The WatchEvent is related to starring a repository, not watching.
 * See this API blog post for an explanation.
 *
 * The event’s actor is the user who starred a repository,
 * and the event’s repository is the repository that was starred.
 */
export type WatchEvent = {
  action: 'started',
};

export type GithubEvent =
  | GithubCommitCommentEvent
  | CreateEvent
  | DeleteEvent
  | ForkEvent
  | GollumEvent
  | IssueCommentEvent
  | IssuesEvent
  | MemberEvent
  | PublicEvent
  | PullRequestEvent
  | PullRequestReviewEvent
  | PullRequestReviewCommentEvent
  | PushEvent
  | ReleaseEvent
  | WatchEvent
;

export type GithubEventType =
  'CommitCommentEvent'
  | 'CreateEvent'
  | 'DeleteEvent'
  | 'ForkEvent'
  | 'GollumEvent'
  | 'IssueCommentEvent'
  | 'IssuesEvent'
  | 'MemberEvent'
  | 'PublicEvent'
  | 'PullRequestEvent'
  | 'PullRequestReviewEvent'
  | 'PullRequestReviewCommentEvent'
  | 'PushEvent'
  | 'ReleaseEvent'
  | 'WatchEvent'

  // not visible in timelines
  // | 'DeploymentEvent'
  // | 'DeploymentStatusEvent'
  // | 'DownloadEvent'
  // | 'FollowEvent'
  // | 'ForkApplyEvent'
  // | 'GistEvent'
  // | 'LabelEvent'
  // | 'MembershipEvent'
  // | 'MilestoneEvent'
  // | 'PageBuildEvent'
  // | 'RepositoryEvent'
  // | 'StatusEvent'
  // | 'TeamAddEvent'
  ;

export type GithubIcon =
  | 'alert'
    | 'arrow-down'
    | 'arrow-left'
    | 'arrow-right'
    | 'arrow-small-down'
    | 'arrow-small-left'
    | 'arrow-small-right'
    | 'arrow-small-up'
    | 'arrow-up'
    | 'beaker'
    | 'bell'
    | 'bold'
    | 'book'
    | 'bookmark'
    | 'briefcase'
    | 'broadcast'
    | 'browser'
    | 'bug'
    | 'calendar'
    | 'check'
    | 'checklist'
    | 'chevron-down'
    | 'chevron-left'
    | 'chevron-right'
    | 'chevron-up'
    | 'circle-slash'
    | 'circuit-board'
    | 'clippy'
    | 'clock'
    | 'cloud-download'
    | 'cloud-upload'
    | 'code'
    | 'comment'
    | 'comment-discussion'
    | 'credit-card'
    | 'dash'
    | 'dashboard'
    | 'database'
    | 'desktop-download'
    | 'device-camera'
    | 'device-camera-video'
    | 'device-desktop'
    | 'device-mobile'
    | 'diff'
    | 'diff-added'
    | 'diff-ignored'
    | 'diff-modified'
    | 'diff-removed'
    | 'diff-renamed'
    | 'ellipses'
    | 'ellipsis'
    | 'eye'
    | 'file'
    | 'file-binary'
    | 'file-code'
    | 'file-directory'
    | 'file-media'
    | 'file-pdf'
    | 'file-submodule'
    | 'file-symlink-directory'
    | 'file-symlink-file'
    | 'file-text'
    | 'file-zip'
    | 'flame'
    | 'fold'
    | 'gear'
    | 'gift'
    | 'gist'
    | 'gist-secret'
    | 'git-branch'
    | 'git-commit'
    | 'git-compare'
    | 'git-merge'
    | 'git-pull-request'
    | 'globe'
    | 'grabber'
    | 'graph'
    | 'heart'
    | 'history'
    | 'home'
    | 'horizontal-rule'
    | 'hubot'
    | 'inbox'
    | 'info'
    | 'issue-closed'
    | 'issue-opened'
    | 'issue-reopened'
    | 'italic'
    | 'jersey'
    | 'key'
    | 'keyboard'
    | 'law'
    | 'light-bulb'
    | 'link'
    | 'link-external'
    | 'list-ordered'
    | 'list-unordered'
    | 'location'
    | 'lock'
    | 'logo-gist'
    | 'logo-github'
    | 'mail'
    | 'mail-read'
    | 'mail-reply'
    | 'mark-github'
    | 'markdown'
    | 'megaphone'
    | 'mention'
    | 'milestone'
    | 'mirror'
    | 'mortar-board'
    | 'mute'
    | 'no-newline'
    | 'note'
    | 'octoface'
    | 'organization'
    | 'package'
    | 'paintcan'
    | 'pencil'
    | 'person'
    | 'pin'
    | 'plug'
    | 'plus'
    | 'plus-small'
    | 'primitive-dot'
    | 'primitive-square'
    | 'project'
    | 'pulse'
    | 'question'
    | 'quote'
    | 'radio-tower'
    | 'reply'
    | 'repo'
    | 'repo-clone'
    | 'repo-force-push'
    | 'repo-forked'
    | 'repo-pull'
    | 'repo-push'
    | 'rocket'
    | 'rss'
    | 'ruby'
    | 'screen-full'
    | 'screen-normal'
    | 'search'
    | 'server'
    | 'settings'
    | 'shield'
    | 'sign-in'
    | 'sign-out'
    | 'smiley'
    | 'squirrel'
    | 'star'
    | 'stop'
    | 'sync'
    | 'tag'
    | 'tasklist'
    | 'telescope'
    | 'terminal'
    | 'text-size'
    | 'three-bars'
    | 'thumbsdown'
    | 'thumbsup'
    | 'tools'
    | 'trashcan'
    | 'triangle-down'
    | 'triangle-left'
    | 'triangle-right'
    | 'triangle-up'
    | 'unfold'
    | 'unmute'
    | 'unverified'
    | 'verified'
    | 'versions'
    | 'watch'
    | 'x'
    | 'zap'
  ;

export type NotificationsOptions = {
  all?: boolean,
  participating?: boolean,
  since?: Date,
  before?: string,
};

export type GithubNotificationReason =
  | 'assign' // You were assigned to the Issue.
  | 'author' // You created the thread.
  | 'comment' // You commented on the thread.
  | 'invitation' // You accepted an invitation to contribute to the repository.
  | 'manual' // You subscribed to the thread (via an Issue or Pull Request).
  | 'mention' // You were specifically @mentioned in the content.
  | 'state_change' // You changed the thread state (for example, closing an Issue or merging a PR).
  | 'subscribed' // You're watching the repository.
  | 'team_mention' // You were on a team that was mentioned.
;

export type GithubNotification = {
  id: string,
  repository: GithubRepo,
  subject: {
    title: string,
    url: string,
    latest_comment_url: string,
    type: string,
  },
  reason: GithubNotificationReason,
  updated_at: string,
  archived_at: string, // specific to this app
  last_read_at: string,
  last_unread_at: string, // specific to this app
  url: string,
};
