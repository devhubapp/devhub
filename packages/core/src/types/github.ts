export type GitHubAppType = 'app' | 'oauth'
export type GitHubAppTokenType =
  | 'app-user-to-server'
  | 'oauth'
  | 'app-installation'

export type GitHubActivityType =
  | 'ORG_PUBLIC_EVENTS'
  | 'PUBLIC_EVENTS'
  | 'REPO_EVENTS'
  | 'REPO_NETWORK_EVENTS'
  | 'USER_EVENTS'
  | 'USER_ORG_EVENTS'
  | 'USER_PUBLIC_EVENTS'
  | 'USER_RECEIVED_EVENTS'
  | 'USER_RECEIVED_PUBLIC_EVENTS'

export type GitHubExtractParamsFromMethod<F> = F extends (
  params: infer P,
  callback: any,
) => any
  ? P
  : never

export type GitHubExtractResponseFromMethod<F> = F extends (
  params: any,
  callback: any,
) => infer R
  ? R extends Promise<infer RR>
    ? RR
    : R
  : never

export interface GitHubUser {
  id: string | number
  node_id?: string
  display_login?: string
  login: string
  name: string
  avatar_url: string
  gravatar_id?: string
  type?: 'User'
  site_admin?: boolean
  company?: string
  blog?: string
  location?: string
  email?: string
  hireable?: boolean
  bio?: string
  public_gists?: number
  public_repos?: number
  total_private_repos?: number
  private_gists?: number
  followers?: number
  following?: number
  owned_private_repos?: number
  disk_usage?: number
  collaborators?: number
  two_factor_authentication: boolean
  plan: {
    name: string
    space: number
    collaborators: number
    private_repos: number
  }
  url: string
  html_url?: string
  created_at: string
  updated_at: string
}

export interface GitHubReaction {
  total_count: number
  '+1': number
  '-1': number
  laugh: number
  confused: number
  heart: number
  hooray: number
  url: string // 'https://api.github.com/repos/octocat/Hello-World/comments/1/reactions'
}

export interface GitHubComment {
  id: number | string
  commit_id?: string // 6ef64f902613c73251da32d1bc9eb236f38798cc
  user: GitHubUser
  body: string
  position?: number | null
  line?: number | null
  path?: number | null
  reactions?: GitHubReaction[]
  created_at: string // 2016-11-24T16:00:16Z
  updated_at: string // 2016-11-24T16:00:16Z
  html_url: string // https://github.com/richelbilderbeek/pbdmms/commit/6ef64f902613c73251da32d1bc9eb236f38798cc#commitcomment-19954756
  url: string // https://api.github.com/repos/richelbilderbeek/pbdmms/comments/19954756
}

export interface GitHubPushedCommit {
  sha: string
  message: string
  author: {
    name: string
    email: string
  }
  distinct: boolean // Whether this commit is distinct from any that have been pushed before.
  forced: boolean
  url: string
}

export interface GitHubCommit {
  sha: string
  node_id: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    committer: {
      name: string
      email: string
      date: string
    }
    message: string
    tree: {
      sha: string
      url: string
    }
    url: string
    comment_count: number
    verification: {
      verified: boolean
      reason: string
      signature: any
      payload: any
    }
  }
  url: string
  html_url: string
  author?: GitHubUser
  committer: GitHubUser
  parents: Array<{
    sha: string
    url: string
    html_url: string
  }>
  stats: {
    total: number
    additions: number
    deletions: number
  }
  files: any[]
}

export interface GitHubLabel {
  id: number | string
  name: string
  color: string // CCCCCC
  default: boolean
  url: string // https://api.github.com/repos/richelbilderbeek/pbdmms/comments/19954756
}

export interface GitHubMilestone {
  id: number | string // 1165557
  number: number // 5
  title: string // 30
  description: string // Knesset 30 - future issues / will be fixed later
  creator: GitHubUser
  open_issues: number // 17
  closed_issues: number // 1
  state: 'open' | 'closed' // open
  created_at: string // 2015-06-15T18:46:59Z
  updated_at: string // 2016-05-23T18:01:44Z
  due_on: string // 2035-04-30T21:00:00Z
  closed_at: string | null // null
  html_url: string // https://github.com/hasadna/Open-Knesset/milestones/30
  url: string // https://api.github.com/repos/hasadna/Open-Knesset/milestones/5
}

export interface GitHubIssue {
  id: number | string
  user: GitHubUser
  assignee?: GitHubUser | null
  assignees?: GitHubUser[]
  number: number
  body: string
  title: string
  labels: GitHubLabel[]
  state: 'open' | 'closed'
  locked: boolean
  milestone?: GitHubMilestone | null
  comments: number
  created_at: string // 2016-11-24T16:00:16Z
  updated_at: string // 2016-11-24T16:00:16Z
  html_url: string // https://github.com/hasadna/Open-Knesset/issues/345
  url: string // https://api.github.com/repos/hasadna/Open-Knesset/issues/345
  repository_url: string // https://api.github.com/repos/devhubapp/devhub
}

export interface GitHubOrg {
  id: number | string
  node_id?: string
  login: string
  avatar_url: string
  gravatar_id?: string
  type?: 'Organization'
  url: string // https://api.github.com/orgs/DefinitelyTyped
}

export interface GitHubPullRequest {
  id: number | string // 95201658
  number: number // 2
  state: 'open' | 'closed' // closed
  locked: boolean // false
  title: string // ok
  labels: GitHubLabel[]
  user: GitHubUser
  body: string //
  created_at: string // 2016-11-24T15:59:50Z
  updated_at: string // 2016-11-24T16:00:02Z
  closed_at: string | null // 2016-11-24T16:00:02Z
  merged_at: string | null // 2016-11-24T16:00:02Z
  merge_commit_sha: string | null // e94fd3c0ed8b1fe095acad353ef27c43dfd7ce9b
  assignee?: GitHubUser | null // null
  assignees?: GitHubUser[] | null // []
  milestone?: GitHubMilestone | null // null
  head: object // object
  base: object // object
  _links: {
    [key: string]: {
      href: string
    }
  }
  draft: boolean
  merged: boolean // true
  mergeable: boolean // null
  mergeable_state: string // unknown
  merged_by: GitHubUser // User
  comments: number // 0
  review_comments: number // 0
  commits: number // 2
  additions: number // 4
  deletions: number // 4
  changed_files: number // 1
  html_url: string // https://github.com/billy0920/hotsite/pull/2
  url: string // https://api.github.com/repos/billy0920/hotsite/pulls/2
  repository_url: string // https://api.github.com/repos/devhubapp/devhub
}

export interface GitHubRepo {
  id: number | string
  name: string
  full_name?: string
  fork: boolean
  private: boolean
  owner?: GitHubOrg | GitHubUser | undefined
  url: string // https://api.github.com/repos/facebook/react
  html_url: string // https://github.com/facebook/react
}

export interface GitHubPage {
  action: 'created' | 'edited'
  page_name: string
  sha: string
  title: string
  html_url: string
  url: string
}

export interface GitHubRelease {
  id: number | string // 1
  tag_name: string // "v1.0.0"
  target_commitish: string // "master"
  name: string // "v1.0.0"
  body: string // "Description of the release"
  draft: boolean
  prerelease: boolean
  created_at: string // "2013-02-27T19:35:32Z"
  published_at: string // "2013-02-27T19:35:32Z"
  author: GitHubUser
  assets: any[] // see https://developer.github.com/v3/repos/releases/#get-a-single-release
  url: string // "https://api.github.com/repos/octocat/Hello-World/releases/1"
  html_url: string // "https://github.com/octocat/Hello-World/releases/v1.0.0"
}

/**
 * Triggered when a commit comment is created.
 * https://developer.github.com/v3/repos/comments/#list-commit-comments-for-a-repository
 */
export interface GitHubCommitCommentEvent {
  id: string
  type: 'CommitCommentEvent'
  actor: GitHubUser
  org?: GitHubOrg
  repo: GitHubRepo
  payload: {
    comment: GitHubComment
  }
  public?: boolean
  created_at: string
}

/**
 * Represents a created repository, branch, or tag.
 * Note: webhooks will not receive this event for created repositories.
 * Additionally, webhooks will not receive this event for tags
 * if more than three tags are pushed at once.
 */
export interface GitHubCreateEvent {
  id: string
  type: 'CreateEvent'
  actor: GitHubUser
  org?: GitHubOrg
  repo: GitHubRepo
  payload: {
    ref: string | null // The git ref (or null if only a repository was created).
    ref_type: 'repository' | 'branch' | 'tag' // The object that was created.
    master_branch: string // The name of the repository's default branch (usually master).
    description: string // The reposit ory's current description.
    pusher_type: 'user' | string
  }
  public?: boolean
  created_at: string
}

/**
 * Represents a deleted branch or tag.
 * Note: webhooks will not receive this event for tags if more than three tags are deleted at once.
 */
export interface GitHubDeleteEvent {
  id: string
  type: 'DeleteEvent'
  actor: GitHubUser
  org?: GitHubOrg
  repo: GitHubRepo
  payload: {
    ref: string // The full git ref.
    ref_type: 'branch' | 'repository' | 'tag' // The object that was deleted.
    pusher_type: 'user' | string
  }
  public?: boolean
  created_at: string
}

/**
 * Triggered when a user forks a repository.
 * https://developer.github.com/v3/repos/forks/#create-a-fork
 */
export interface GitHubForkEvent {
  id: string
  type: 'ForkEvent'
  actor: GitHubUser
  org?: GitHubOrg
  repo: GitHubRepo
  payload: {
    forkee: GitHubRepo // The created repository.
  }
  public?: boolean
  created_at: string
}

/**
 * Triggered when a Wiki page is created or updated.
 */
export interface GitHubGollumEvent {
  id: string
  type: 'GollumEvent'
  actor: GitHubUser
  repo: GitHubRepo
  payload: {
    pages: GitHubPage[]
  }
  public?: boolean
  created_at: string
}

/**
 * Triggered when an issue comment is created, edited, or deleted.
 * https://developer.github.com/v3/issues/comments/
 */
export interface GitHubIssueCommentEvent {
  id: string
  type: 'IssueCommentEvent'
  actor: GitHubUser & { username?: undefined }
  repo: GitHubRepo
  org: GitHubOrg
  public?: boolean
  payload: {
    action: 'created' | 'edited' | 'deleted'
    issue: GitHubIssue // The issue the comment belongs to.
    comment: GitHubComment // The comment itself.
    changes?: object // The changes to the comment if the action was 'edited'.
  }
  created_at: string
}

/**
 * Triggered when an issue is assigned, unassigned, labeled, unlabeled,
 * opened, edited, milestoned, demilestoned, closed, or reopened.
 * https://developer.github.com/v3/issues
 */
export interface GitHubIssuesEvent {
  id: string
  type: 'IssuesEvent'
  actor: GitHubUser
  repo: GitHubRepo
  payload: {
    action:
      | 'assigned'
      | 'unassigned'
      | 'labeled'
      | 'unlabeled'
      | 'opened'
      | 'edited'
      | 'milestoned'
      | 'demilestoned'
      | 'closed'
      | 'reopened'
    issue: GitHubIssue // The issue itself.
    changes?: object // The changes to the issue if the action was 'edited'.
    assignee?: GitHubUser | null // The optional user who was assigned or unassigned from the issue.
    label?: GitHubLabel // The optional label that was added or removed from the issue.
  }
  public?: boolean
  created_at: string
  url: string
  html_url: string
}

/**
 * Triggered when a user is added as a collaborator to a repository.
 * https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator
 */
export interface GitHubMemberEvent {
  id: string
  type: 'MemberEvent'
  actor: GitHubUser
  repo: GitHubRepo
  payload: {
    action: 'added' // The action that was performed.
    member: GitHubUser // The user that was added.
  }
  public?: boolean
  created_at: string
}

/**
 * Triggered when a private repository is open sourced.
 * https://developer.github.com/v3/repos/#edit
 */
export interface GitHubPublicEvent {
  id: string
  type: 'PublicEvent'
  actor: GitHubUser
  created_at: string
  payload: {}
  public?: boolean
  repo: GitHubRepo
}

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
export interface GitHubPullRequestEvent {
  id: string
  type: 'PullRequestEvent'
  actor: GitHubUser
  repo: GitHubRepo
  payload: {
    action:
      | 'assigned'
      | 'unassigned'
      | 'labeled'
      | 'unlabeled'
      | 'opened'
      | 'edited'
      | 'closed'
      | 'reopened'
    number: number
    pull_request: GitHubPullRequest
    sender: object
  }
  public?: boolean
  created_at: string
}

/**
 * Triggered when a pull request review is submitted into a non-pending state.
 */
export interface GitHubPullRequestReviewEvent {
  id: string
  type: 'PullRequestReviewEvent'
  actor: GitHubUser
  repo: GitHubRepo
  payload: {
    action: 'submitted'
    pull_request: GitHubPullRequest
    review: object
  }
  public?: boolean
  created_at: string
}

/**
 * Triggered when a comment on a Pull Request's unified diff is created,
 * edited, or deleted (in the Files Changed tab).
 * https://developer.github.com/v3/pulls/comments
 */
export interface GitHubPullRequestReviewCommentEvent {
  id: string
  type: 'PullRequestReviewCommentEvent'
  actor: GitHubUser
  repo: GitHubRepo
  payload: {
    action: 'created' | 'edited' | 'deleted'
    changes?: object
    pull_request: GitHubPullRequest
    comment: GitHubComment
  }
  public?: boolean
  created_at: string
}

/**
 * Triggered when a repository branch is pushed to.
 * In addition to branch pushes, webhook push events
 * are also triggered when repository tags are pushed.
 */
export interface GitHubPushEvent {
  id: string
  type: 'PushEvent'
  actor: GitHubUser
  repo: GitHubRepo
  payload: {
    ref: string // The full Git ref that was pushed. Example: 'refs/heads/master'.
    head: string // The SHA of the most recent commit on ref after the push.
    before: string // The SHA of the most recent commit on ref before the push.
    size: number // The number of commits in the push.
    distinct_size: number // The number of distinct commits in the push.
    commits: GitHubPushedCommit[]
  }
  public?: boolean
  forced?: boolean
  created_at: string
}

/**
 * Triggered when a release is published.
 * https://developer.github.com/v3/repos/releases/#get-a-single-release
 */
export interface GitHubReleaseEvent {
  id: string
  type: 'ReleaseEvent'
  actor: GitHubUser
  repo: GitHubRepo
  payload: {
    action: 'published'
    release: GitHubRelease // https://developer.github.com/v3/repos/releases/#get-a-single-release
  }
  public?: boolean
  created_at: string
}

/**
 * The WatchEvent is related to starring a repository, not watching.
 * See this API blog post for an explanation.
 *
 * The event’s actor is the user who starred a repository,
 * and the event’s repository is the repository that was starred.
 */
export interface GitHubWatchEvent {
  id: string
  type: 'WatchEvent'
  actor: GitHubUser
  repo: GitHubRepo
  payload: {
    action: 'started'
  }
  public?: boolean
  created_at: string
}

export type GitHubEvent =
  | GitHubCreateEvent
  | GitHubDeleteEvent
  | GitHubForkEvent
  | GitHubCommitCommentEvent
  | GitHubGollumEvent
  | GitHubIssueCommentEvent
  | GitHubIssuesEvent
  | GitHubMemberEvent
  | GitHubPublicEvent
  | GitHubPullRequestEvent
  | GitHubPullRequestReviewCommentEvent
  | GitHubPullRequestReviewEvent
  | GitHubPushEvent
  | GitHubReleaseEvent
  | GitHubWatchEvent

export type GitHubEventAction =
  | 'added'
  | 'commented'
  | 'created'
  | 'deleted'
  | 'forked'
  | 'pushed'
  | 'released'
  | 'reviewed'
  | 'starred'
  | 'state_changed'
  | 'updated'

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

export type GitHubEventSubjectType =
  | 'Branch'
  | 'Commit'
  | 'Issue'
  | 'PullRequest'
  | 'PullRequestReview'
  | 'Release'
  | 'Repository'
  | 'Tag'
  | 'User'
  | 'Wiki'

export type GitHubIssueOrPullRequestSubjectType = 'Issue' | 'PullRequest'

export type GitHubIcon =
  | 'alert'
  | 'archive'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-ref_type-down'
  | 'arrow-right'
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

export interface GitHubNotificationsOptions {
  all?: boolean
  participating?: boolean
  since?: Date
  before?: string
}

// You were on a team that was mentioned.
export type GitHubNotificationReason =
  | 'assign' // You were assigned to the Issue.
  | 'author' // You created the thread.
  | 'comment' // You commented on the thread.
  | 'invitation' // You accepted an invitation to contribute to the repository.
  | 'manual' // You subscribed to the thread (via an Issue or Pull Request).
  | 'mention' // You were specifically @mentioned in the content.
  | 'review_requested' // Someone requested your review on a pull request
  | 'security_alert' // Potential security vulnerability alert
  | 'state_change' // You changed the thread state (for example, closing an Issue or merging a PR).
  | 'subscribed' // You're watching the repository.
  | 'team_mention' // A team you are part of were @mentioned in the content.

export type GitHubNotificationSubjectType =
  | 'Commit'
  | 'Issue'
  | 'PullRequest'
  | 'Release'
  | 'RepositoryInvitation'
  | 'RepositoryVulnerabilityAlert'

export interface GitHubNotification {
  id: number | string
  last_read_at?: string
  reason: GitHubNotificationReason
  repository: GitHubRepo
  subject: {
    title: string
    url: string
    latest_comment_url: string
    type: GitHubNotificationSubjectType
  }
  unread?: boolean
  updated_at: string
  url: string
}

export interface GitHubAPIHeaders {
  pollInterval?: number
  rateLimitLimit?: number
  rateLimitRemaining?: number
  rateLimitReset?: number
}
