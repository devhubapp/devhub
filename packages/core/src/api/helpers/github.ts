export type GitHubGraphQLResourceFragment =
  | 'Commit'
  | 'Issue'
  | 'PullRequest'
  | 'Release'
  | 'Repository'

export type GitHubGraphQLFragment =
  | GitHubGraphQLResourceFragment
  | 'Actor'
  | 'Comment'
  | 'Commit'
  | 'IssueTimelineItem'
  | 'Label'
  | 'Node'

export function getResourceSubQuery(
  type: GitHubGraphQLResourceFragment,
  resourceURL: string,
  alias: string,
) {
  switch (type) {
    case 'Commit':
      return `${alias || 'commit'}: resource(url: "${resourceURL}") {
    ... on Commit {
      ...Commit
    }
  }`

    case 'Issue':
      return `${alias || 'issue'}: resource(url: "${resourceURL}") {
    ... on Issue {
      ...Issue
    }
  }`

    case 'PullRequest':
      return `${alias || 'pull'}: resource(url: "${resourceURL}") {
    ... on PullRequest {
      ...PullRequest
    }
  }`

    case 'Release':
      return `${alias || 'release'}: resource(url: "${resourceURL}") {
    ... on Release {
      ...Release
    }
  }`

    case 'Repository':
      return `${alias || 'repo'}: resource(url: "${resourceURL}") {
    ... on Repository {
      ...Repository
    }
  }`

    default:
      return ''
  }
}

export const NodeFragment = `fragment Node on Node {
  __typename
  nodeId: id
}`
export interface NodeFragment {
  __typename: string
  nodeId: string
}

export const ActorFragment = `fragment Actor on Actor {
  __typename
  login
  avatarUrl
  url
}`
export interface ActorFragment {
  __typename: string
  login: string
  avatarUrl: string
  url: string
}
export interface ActorWithNodeFragment extends NodeFragment, ActorFragment {}

export const RepositoryFragment = `fragment Repository on Repository {
  ...Node
  isFork
  isPrivate
  viewerSubscription
  name
  nameWithOwner
  owner {
    ...Node
    ...Actor
  }
  url
}`
export type SubscriptionState = 'UNSUBSCRIBED' | 'SUBSCRIBED' | 'IGNORED' | null
export interface RepositoryFragment extends NodeFragment {
  isFork: boolean
  isPrivate: boolean
  viewerSubscription: SubscriptionState | undefined
  name: string
  nameWithOwner: string
  owner: ActorWithNodeFragment
  url: string
}

export const CommentFragment = `fragment Comment on Comment {
  ...Node
  author {
    ...Node
    ...Actor
  }
  bodyText
  createdAt
  updatedAt
}`
export interface CommentFragmentWithoutURL extends NodeFragment {
  author: ActorWithNodeFragment
  bodyText: string
  createdAt: string
  updatedAt: string
}
export interface CommentWithURLFragment extends CommentFragmentWithoutURL {
  url: string
}
export interface CommentWithURLAndPathFragment extends CommentWithURLFragment {
  path?: string
}

export const IssueTimelineItemFragment = `fragment IssueTimelineItem on IssueTimelineItem {
  ...Node
  ... on ClosedEvent {
    actor {
      ...Node
      ...Actor
    }
    createdAt
    url
  }
  ... on ReopenedEvent {
    actor {
      ...Node
      ...Actor
    }
    createdAt
  }
  ... on LockedEvent {
    actor {
      ...Node
      ...Actor
    }
    createdAt
  }
  ... on UnlockedEvent {
    actor {
      ...Node
      ...Actor
    }
    createdAt
  }
}`
export interface IssueTimelineItemFragment extends NodeFragment {
  __typename: 'ClosedEvent' | 'ReopenedEvent' | 'LockedEvent' | 'UnlockedEvent'
  actor: ActorWithNodeFragment
  createdAt: string
  url?: string
}

export const LabelFragment = `fragment Label on Label {
  ...Node
  color
  isDefault
  name
  url
}`
export interface LabelFragment extends NodeFragment {
  color: string
  isDefault: boolean
  name: string
  url: string
}

export const IssueFragment = `fragment Issue on Issue {
  ...Node
  state
  number
  title
  author {
    ...Node
    ...Actor
  }
  bodyText
  closedAt
  createdAt
  assignees(first: 10) {
    nodes {
      ...Node
      ...Actor
    }
  }
  labels(first: 10) {
    nodes {
      ...Label
    }
  }
  locked
  comments(last: 1) {
    totalCount
    nodes {
      ...Comment
      url
    }
  }
  timelineItems(last: 1, itemTypes: [CLOSED_EVENT, REOPENED_EVENT, LOCKED_EVENT, UNLOCKED_EVENT]) {
    nodes {
      ...IssueTimelineItem
    }
  }
  updatedAt
  url
}`
export type IssueState = 'OPEN' | 'CLOSED'
export interface IssueFragment extends NodeFragment {
  state: IssueState
  number: number
  title: string
  author: ActorWithNodeFragment
  bodyText: string
  closedAt: string | null
  createdAt: string
  comments: {
    totalCount: number
    nodes: CommentWithURLFragment[]
  }
  assignees: {
    nodes: ActorWithNodeFragment[]
  }
  labels: {
    nodes: LabelFragment[]
  }
  locked: boolean
  timelineItems: {
    nodes: IssueTimelineItemFragment[]
  }
  updatedAt: string
  url: string
}

export const PullRequestFragment = `fragment PullRequest on PullRequest {
  ...Node
  state
  number
  title
  author {
    ...Node
    ...Actor
  }
  bodyText
  closedAt
  createdAt
  comments(last: 1) {
    totalCount
    nodes {
      ...Comment
      url
    }
  }
  assignees(first: 10) {
    nodes {
      ...Node
      ...Actor
    }
  }
  labels(first: 10) {
    nodes {
      ...Label
    }
  }
  locked
  mergedAt
  mergedBy {
    ...Node
    ...Actor
  }
  timelineItems(last: 1, itemTypes: [CLOSED_EVENT, MERGED_EVENT, REOPENED_EVENT, LOCKED_EVENT, UNLOCKED_EVENT]) {
    nodes {
      ...IssueTimelineItem
      ... on MergedEvent {
        actor {
          ...Node
          ...Actor
        }
        createdAt
      }
    }
  }
  updatedAt
  url
}`
export type PullRequestState = IssueState | 'MERGED'
export interface PullRequestTimelineItemFragment
  extends Omit<IssueTimelineItemFragment, '__typename'> {
  __typename: IssueTimelineItemFragment['__typename'] | 'MERGED_EVENT'
}
export interface PullRequestFragment extends NodeFragment {
  state: PullRequestState
  number: number
  title: string
  author: ActorWithNodeFragment
  bodyText: string
  createdAt: string
  closedAt: string | null
  assignees: {
    nodes: ActorWithNodeFragment[]
  }
  comments: {
    totalCount: number
    nodes: CommentWithURLFragment[]
  }
  labels: {
    nodes: LabelFragment[]
  }
  locked: boolean
  mergedAt: string | null
  mergedBy: ActorWithNodeFragment
  timelineItems: {
    nodes: PullRequestTimelineItemFragment[]
  }
  updatedAt: string
  url: string
}

export const CommitFragment = `fragment Commit on Commit {
  ...Node
  author {
    avatarUrl
    email
    name
    user {
      ...Node
      ...Actor
    }
    date
  }
  committer {
    avatarUrl
    email
    name
    user {
      ...Node
      ...Actor
    }
    date
  }
  comments(last: 1) {
    totalCount
    nodes {
      ...Comment
      path
      url
    }
  }
  messageHeadline
  oid
  url
}`
export interface CommitFragment extends NodeFragment {
  author: {
    avatarUrl: string
    email?: string
    name: string
    user: ActorWithNodeFragment | null
    date: string
  }
  committer: {
    avatarUrl: string
    email?: string
    name: string
    user: ActorWithNodeFragment | null
    date: string
  }
  comments: {
    totalCount: number
    nodes: CommentWithURLAndPathFragment[]
  }
  messageHeadline: string
  oid: string
  url: string
}

export const ReleaseFragment = `fragment Release on Release {
  ...Node
  author {
    ...Node
    ...Actor
  }
  createdAt
  description
  isDraft
  isPrerelease
  name
  publishedAt
  tagName
  updatedAt
  url
}`
export interface ReleaseFragment extends NodeFragment {
  author: ActorWithNodeFragment
  createdAt: string
  description: string
  isDraft: boolean
  isPrerelease: boolean
  name: string
  publishedAt: string
  tagName: string
  updatedAt: string
  url: string
}

export const allFragments: Record<GitHubGraphQLFragment, string> = {
  Actor: ActorFragment,
  Comment: CommentFragment,
  Commit: CommitFragment,
  Issue: IssueFragment,
  IssueTimelineItem: IssueTimelineItemFragment,
  Label: LabelFragment,
  Node: NodeFragment,
  PullRequest: PullRequestFragment,
  Release: ReleaseFragment,
  Repository: RepositoryFragment,
}

const allFragmentsKeys = Object.keys(allFragments) as GitHubGraphQLFragment[]

export function getAllReferencedFragments(query: string) {
  const referencedFragmentsKeys = (arguments[1] ||
    []) as GitHubGraphQLFragment[]

  for (const fragmentKey of allFragmentsKeys) {
    if (referencedFragmentsKeys.includes(fragmentKey)) continue
    if (!query.match(new RegExp(`\.\.\.${fragmentKey}[ \r\n}]`))) continue

    referencedFragmentsKeys.push(fragmentKey)
    ;(getAllReferencedFragments as any)(
      allFragments[fragmentKey],
      referencedFragmentsKeys,
    )
  }

  return referencedFragmentsKeys
    .map(fragmentKey => allFragments[fragmentKey])
    .join('\n\n')
}
