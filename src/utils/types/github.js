/**
 * @flow
 * https://developer.github.com/v3/activity/events/types/#watchevent
 */

/**
 * Triggered when a commit comment is created.
 * https://developer.github.com/v3/repos/comments/#list-commit-comments-for-a-repository
 */
export type CommitCommentEvent = {
  comment: Object,
};

/**
 * Represents a created repository, branch, or tag.
 * Note: webhooks will not receive this event for created repositories.
 * Additionally, webhooks will not receive this event for tags
 * if more than three tags are pushed at once.
 */
export type CreateEvent = {
  ref: ?string, // The git ref (or null if only a repository was created).
  ref_type: 'repository' | 'branch' | 'tag', // The object that was created.
  master_branch: 'string', // The name of the repository's default branch (usually master).
  description: 'string', // The repository's current description.
};

/**
 * Represents a deleted branch or tag.
 * Note: webhooks will not receive this event for tags if more than three tags are deleted at once.
 */
export type DeleteEvent = {
  ref: string, // 	The full git ref.
  ref_type: 'branch' | 'tag', // The object that was deleted.
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
  pages: Array,
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
  pull_request: Object,
  repository: Object,
  sender: Object,
};

/**
 * Triggered when a pull request review is submitted into a non-pending state.
 */
export type PullRequestReviewEvent = {
  action: 'submitted',
  pull_request: Object,
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
  pull_request: Object,
  comment: Object,
};

/**
 * Triggered when a repository branch is pushed to.
 * In addition to branch pushes, webhook push events
 * are also triggered when repository tags are pushed.
 */
export type PushEvent = {
  ref: string, // The full Git ref that was pushed. Example: "refs/heads/master".
  head: string, // The SHA of the most recent commit on ref after the push.
  before: string, // The SHA of the most recent commit on ref before the push.
  size: number, // The number of commits in the push.
  distinct_size: number, // The number of distinct commits in the push.
  commits: Array<{
    sha: string,
    message: string,
    author: {
      name: string,
      email: string,
    },
    url: string,
    distinct: boolean, // Whether this commit is distinct from any that have been pushed before.
    forced: boolean,
  }>,
};

/**
 * Triggered when a release is published.
 * https://developer.github.com/v3/repos/releases/#get-a-single-release
 */
export type ReleaseEvent = {
  action: 'published'
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
  | 'CommitCommentEvent'
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
