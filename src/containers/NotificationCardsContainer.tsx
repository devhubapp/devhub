import React, { PureComponent } from 'react'

import NotificationCards from '../components/cards/NotificationCards'
import { IGitHubNotification } from '../types'

export interface IProps {}

export interface IState {
  notifications: IGitHubNotification[]
}

export default class NotificationCardsContainer extends PureComponent<
  IProps,
  IState
> {
  state = { notifications: _data }

  render() {
    const { notifications } = this.state

    return <NotificationCards notifications={notifications} />
  }
}

// tslint:disable object-literal-sort-keys max-line-length
const _data: IGitHubNotification[] = [
  {
    id: '283628038',
    unread: false,
    reason: 'assign',
    updated_at: '2018-01-05T23:30:30Z',
    last_read_at: '2018-01-05T23:40:40Z',
    subject: {
      title: 'Release candidate',
      url: 'https://api.github.com/repos/adeelraza/MinderNative/pulls/687',
      latest_comment_url: null,
      type: 'PullRequest',
    },
    repository: {
      id: 45067132,
      name: 'MinderNative',
      full_name: 'adeelraza/MinderNative',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/MinderNative',
      description: 'React Native Minder App',
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/MinderNative',
      forks_url: 'https://api.github.com/repos/adeelraza/MinderNative/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/MinderNative/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/MinderNative/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/MinderNative/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/MinderNative/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/events{/number}',
      events_url: 'https://api.github.com/repos/adeelraza/MinderNative/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/MinderNative/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/MinderNative/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/MinderNative/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/MinderNative/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/MinderNative/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/adeelraza/MinderNative/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/MinderNative/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/MinderNative/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/MinderNative/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/MinderNative/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/MinderNative/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/MinderNative/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/MinderNative/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/deployments',
    },
    url: 'https://api.github.com/notifications/threads/283628038',
    subscription_url:
      'https://api.github.com/notifications/threads/283628038/subscription',
  },
  {
    id: '288630656',
    unread: false,
    reason: 'mention',
    updated_at: '2018-01-05T23:30:16Z',
    last_read_at: '2018-01-05T23:40:40Z',
    subject: {
      title: 'New Admin features',
      url: 'https://api.github.com/repos/adeelraza/MinderNative/pulls/698',
      latest_comment_url: null,
      type: 'PullRequest',
    },
    repository: {
      id: 45067132,
      name: 'MinderNative',
      full_name: 'adeelraza/MinderNative',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/MinderNative',
      description: 'React Native Minder App',
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/MinderNative',
      forks_url: 'https://api.github.com/repos/adeelraza/MinderNative/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/MinderNative/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/MinderNative/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/MinderNative/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/MinderNative/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/events{/number}',
      events_url: 'https://api.github.com/repos/adeelraza/MinderNative/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/MinderNative/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/MinderNative/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/MinderNative/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/MinderNative/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/MinderNative/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/adeelraza/MinderNative/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/MinderNative/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/MinderNative/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/MinderNative/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/MinderNative/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/MinderNative/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/MinderNative/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/MinderNative/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/deployments',
    },
    url: 'https://api.github.com/notifications/threads/288630656',
    subscription_url:
      'https://api.github.com/notifications/threads/288630656/subscription',
  },
  {
    id: '288297222',
    unread: false,
    reason: 'mention',
    updated_at: '2018-01-06T01:43:20Z',
    last_read_at: '2018-01-06T15:32:53Z',
    subject: {
      title:
        '[new-rule-option] [object-literal-sort-key] Add shorthand-first option',
      url: 'https://api.github.com/repos/palantir/tslint/pulls/3607',
      latest_comment_url:
        'https://api.github.com/repos/palantir/tslint/issues/comments/355713503',
      type: 'PullRequest',
    },
    repository: {
      id: 11672345,
      name: 'tslint',
      full_name: 'palantir/tslint',
      owner: {
        login: 'palantir',
        id: 303157,
        avatar_url: 'https://avatars0.githubusercontent.com/u/303157?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/palantir',
        html_url: 'https://github.com/palantir',
        followers_url: 'https://api.github.com/users/palantir/followers',
        following_url:
          'https://api.github.com/users/palantir/following{/other_user}',
        gists_url: 'https://api.github.com/users/palantir/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/palantir/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/palantir/subscriptions',
        organizations_url: 'https://api.github.com/users/palantir/orgs',
        repos_url: 'https://api.github.com/users/palantir/repos',
        events_url: 'https://api.github.com/users/palantir/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/palantir/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/palantir/tslint',
      description:
        ':vertical_traffic_light: An extensible linter for the TypeScript language',
      fork: false,
      url: 'https://api.github.com/repos/palantir/tslint',
      forks_url: 'https://api.github.com/repos/palantir/tslint/forks',
      keys_url: 'https://api.github.com/repos/palantir/tslint/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/palantir/tslint/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/palantir/tslint/teams',
      hooks_url: 'https://api.github.com/repos/palantir/tslint/hooks',
      issue_events_url:
        'https://api.github.com/repos/palantir/tslint/issues/events{/number}',
      events_url: 'https://api.github.com/repos/palantir/tslint/events',
      assignees_url:
        'https://api.github.com/repos/palantir/tslint/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/palantir/tslint/branches{/branch}',
      tags_url: 'https://api.github.com/repos/palantir/tslint/tags',
      blobs_url: 'https://api.github.com/repos/palantir/tslint/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/palantir/tslint/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/palantir/tslint/git/refs{/sha}',
      trees_url: 'https://api.github.com/repos/palantir/tslint/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/palantir/tslint/statuses/{sha}',
      languages_url: 'https://api.github.com/repos/palantir/tslint/languages',
      stargazers_url: 'https://api.github.com/repos/palantir/tslint/stargazers',
      contributors_url:
        'https://api.github.com/repos/palantir/tslint/contributors',
      subscribers_url:
        'https://api.github.com/repos/palantir/tslint/subscribers',
      subscription_url:
        'https://api.github.com/repos/palantir/tslint/subscription',
      commits_url: 'https://api.github.com/repos/palantir/tslint/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/palantir/tslint/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/palantir/tslint/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/palantir/tslint/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/palantir/tslint/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/palantir/tslint/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/palantir/tslint/merges',
      archive_url:
        'https://api.github.com/repos/palantir/tslint/{archive_format}{/ref}',
      downloads_url: 'https://api.github.com/repos/palantir/tslint/downloads',
      issues_url:
        'https://api.github.com/repos/palantir/tslint/issues{/number}',
      pulls_url: 'https://api.github.com/repos/palantir/tslint/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/palantir/tslint/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/palantir/tslint/notifications{?since,all,participating}',
      labels_url: 'https://api.github.com/repos/palantir/tslint/labels{/name}',
      releases_url:
        'https://api.github.com/repos/palantir/tslint/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/palantir/tslint/deployments',
    },
    url: 'https://api.github.com/notifications/threads/288297222',
    subscription_url:
      'https://api.github.com/notifications/threads/288297222/subscription',
  },
  {
    id: '288289541',
    unread: false,
    reason: 'author',
    updated_at: '2018-01-05T22:20:48Z',
    last_read_at: '2018-01-05T22:26:57Z',
    subject: {
      title:
        'Conflict between object-shorthand-properties-first and object-literal-sort-key',
      url: 'https://api.github.com/repos/palantir/tslint/issues/3606',
      latest_comment_url:
        'https://api.github.com/repos/palantir/tslint/issues/3606',
      type: 'Issue',
    },
    repository: {
      id: 11672345,
      name: 'tslint',
      full_name: 'palantir/tslint',
      owner: {
        login: 'palantir',
        id: 303157,
        avatar_url: 'https://avatars0.githubusercontent.com/u/303157?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/palantir',
        html_url: 'https://github.com/palantir',
        followers_url: 'https://api.github.com/users/palantir/followers',
        following_url:
          'https://api.github.com/users/palantir/following{/other_user}',
        gists_url: 'https://api.github.com/users/palantir/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/palantir/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/palantir/subscriptions',
        organizations_url: 'https://api.github.com/users/palantir/orgs',
        repos_url: 'https://api.github.com/users/palantir/repos',
        events_url: 'https://api.github.com/users/palantir/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/palantir/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/palantir/tslint',
      description:
        ':vertical_traffic_light: An extensible linter for the TypeScript language',
      fork: false,
      url: 'https://api.github.com/repos/palantir/tslint',
      forks_url: 'https://api.github.com/repos/palantir/tslint/forks',
      keys_url: 'https://api.github.com/repos/palantir/tslint/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/palantir/tslint/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/palantir/tslint/teams',
      hooks_url: 'https://api.github.com/repos/palantir/tslint/hooks',
      issue_events_url:
        'https://api.github.com/repos/palantir/tslint/issues/events{/number}',
      events_url: 'https://api.github.com/repos/palantir/tslint/events',
      assignees_url:
        'https://api.github.com/repos/palantir/tslint/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/palantir/tslint/branches{/branch}',
      tags_url: 'https://api.github.com/repos/palantir/tslint/tags',
      blobs_url: 'https://api.github.com/repos/palantir/tslint/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/palantir/tslint/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/palantir/tslint/git/refs{/sha}',
      trees_url: 'https://api.github.com/repos/palantir/tslint/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/palantir/tslint/statuses/{sha}',
      languages_url: 'https://api.github.com/repos/palantir/tslint/languages',
      stargazers_url: 'https://api.github.com/repos/palantir/tslint/stargazers',
      contributors_url:
        'https://api.github.com/repos/palantir/tslint/contributors',
      subscribers_url:
        'https://api.github.com/repos/palantir/tslint/subscribers',
      subscription_url:
        'https://api.github.com/repos/palantir/tslint/subscription',
      commits_url: 'https://api.github.com/repos/palantir/tslint/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/palantir/tslint/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/palantir/tslint/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/palantir/tslint/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/palantir/tslint/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/palantir/tslint/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/palantir/tslint/merges',
      archive_url:
        'https://api.github.com/repos/palantir/tslint/{archive_format}{/ref}',
      downloads_url: 'https://api.github.com/repos/palantir/tslint/downloads',
      issues_url:
        'https://api.github.com/repos/palantir/tslint/issues{/number}',
      pulls_url: 'https://api.github.com/repos/palantir/tslint/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/palantir/tslint/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/palantir/tslint/notifications{?since,all,participating}',
      labels_url: 'https://api.github.com/repos/palantir/tslint/labels{/name}',
      releases_url:
        'https://api.github.com/repos/palantir/tslint/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/palantir/tslint/deployments',
    },
    url: 'https://api.github.com/notifications/threads/288289541',
    subscription_url:
      'https://api.github.com/notifications/threads/288289541/subscription',
  },
  {
    id: '290645796',
    unread: false,
    reason: 'assign',
    updated_at: '2018-01-05T19:56:06Z',
    last_read_at: '2018-01-05T20:26:18Z',
    subject: {
      title: 'Fix reports query',
      url: 'https://api.github.com/repos/adeelraza/minder-express/pulls/126',
      latest_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls/126',
      type: 'PullRequest',
    },
    repository: {
      id: 34196773,
      name: 'minder-express',
      full_name: 'adeelraza/minder-express',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/minder-express',
      description: null,
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/minder-express',
      forks_url: 'https://api.github.com/repos/adeelraza/minder-express/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/minder-express/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/minder-express/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/minder-express/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/minder-express/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/adeelraza/minder-express/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/minder-express/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/minder-express/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/minder-express/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/minder-express/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/minder-express/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/minder-express/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/minder-express/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/minder-express/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/minder-express/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/minder-express/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/adeelraza/minder-express/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/minder-express/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/minder-express/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/minder-express/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/minder-express/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/minder-express/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/minder-express/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/minder-express/deployments',
    },
    url: 'https://api.github.com/notifications/threads/290645796',
    subscription_url:
      'https://api.github.com/notifications/threads/290645796/subscription',
  },
  {
    id: '286680488',
    unread: false,
    reason: 'author',
    updated_at: '2018-01-05T18:37:45Z',
    last_read_at: '2018-01-05T19:59:38Z',
    subject: {
      title: 'YellowBox being added to all registered components',
      url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/2371',
      latest_comment_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/comments/355631392',
      type: 'Issue',
    },
    repository: {
      id: 53662249,
      name: 'react-native-navigation',
      full_name: 'wix/react-native-navigation',
      owner: {
        login: 'wix',
        id: 686511,
        avatar_url: 'https://avatars1.githubusercontent.com/u/686511?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/wix',
        html_url: 'https://github.com/wix',
        followers_url: 'https://api.github.com/users/wix/followers',
        following_url:
          'https://api.github.com/users/wix/following{/other_user}',
        gists_url: 'https://api.github.com/users/wix/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/wix/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/wix/subscriptions',
        organizations_url: 'https://api.github.com/users/wix/orgs',
        repos_url: 'https://api.github.com/users/wix/repos',
        events_url: 'https://api.github.com/users/wix/events{/privacy}',
        received_events_url: 'https://api.github.com/users/wix/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/wix/react-native-navigation',
      description: 'A complete native navigation solution for React Native',
      fork: false,
      url: 'https://api.github.com/repos/wix/react-native-navigation',
      forks_url:
        'https://api.github.com/repos/wix/react-native-navigation/forks',
      keys_url:
        'https://api.github.com/repos/wix/react-native-navigation/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/wix/react-native-navigation/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/wix/react-native-navigation/teams',
      hooks_url:
        'https://api.github.com/repos/wix/react-native-navigation/hooks',
      issue_events_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/wix/react-native-navigation/events',
      assignees_url:
        'https://api.github.com/repos/wix/react-native-navigation/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/wix/react-native-navigation/branches{/branch}',
      tags_url: 'https://api.github.com/repos/wix/react-native-navigation/tags',
      blobs_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/wix/react-native-navigation/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/wix/react-native-navigation/languages',
      stargazers_url:
        'https://api.github.com/repos/wix/react-native-navigation/stargazers',
      contributors_url:
        'https://api.github.com/repos/wix/react-native-navigation/contributors',
      subscribers_url:
        'https://api.github.com/repos/wix/react-native-navigation/subscribers',
      subscription_url:
        'https://api.github.com/repos/wix/react-native-navigation/subscription',
      commits_url:
        'https://api.github.com/repos/wix/react-native-navigation/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/wix/react-native-navigation/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/wix/react-native-navigation/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/wix/react-native-navigation/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/wix/react-native-navigation/merges',
      archive_url:
        'https://api.github.com/repos/wix/react-native-navigation/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/wix/react-native-navigation/downloads',
      issues_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/wix/react-native-navigation/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/wix/react-native-navigation/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/wix/react-native-navigation/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/wix/react-native-navigation/labels{/name}',
      releases_url:
        'https://api.github.com/repos/wix/react-native-navigation/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/wix/react-native-navigation/deployments',
    },
    url: 'https://api.github.com/notifications/threads/286680488',
    subscription_url:
      'https://api.github.com/notifications/threads/286680488/subscription',
  },
  {
    id: '290550145',
    unread: false,
    reason: 'comment',
    updated_at: '2018-01-05T15:24:36Z',
    last_read_at: '2018-01-05T17:43:20Z',
    subject: {
      title: 'Rc badges fixes',
      url: 'https://api.github.com/repos/adeelraza/minder-express/pulls/125',
      latest_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls/comments/159901399',
      type: 'PullRequest',
    },
    repository: {
      id: 34196773,
      name: 'minder-express',
      full_name: 'adeelraza/minder-express',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/minder-express',
      description: null,
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/minder-express',
      forks_url: 'https://api.github.com/repos/adeelraza/minder-express/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/minder-express/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/minder-express/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/minder-express/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/minder-express/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/adeelraza/minder-express/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/minder-express/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/minder-express/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/minder-express/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/minder-express/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/minder-express/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/minder-express/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/minder-express/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/minder-express/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/minder-express/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/minder-express/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/adeelraza/minder-express/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/minder-express/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/minder-express/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/minder-express/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/minder-express/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/minder-express/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/minder-express/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/minder-express/deployments',
    },
    url: 'https://api.github.com/notifications/threads/290550145',
    subscription_url:
      'https://api.github.com/notifications/threads/290550145/subscription',
  },
  {
    id: '151305359',
    unread: false,
    reason: 'comment',
    updated_at: '2018-01-05T13:44:28Z',
    last_read_at: '2018-01-05T14:32:11Z',
    subject: {
      title: 'Feature/face detection android',
      url:
        'https://api.github.com/repos/react-native-community/react-native-camera/pulls/332',
      latest_comment_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/issues/comments/355557725',
      type: 'PullRequest',
    },
    repository: {
      id: 33218414,
      name: 'react-native-camera',
      full_name: 'react-native-community/react-native-camera',
      owner: {
        login: 'react-native-community',
        id: 20269980,
        avatar_url: 'https://avatars1.githubusercontent.com/u/20269980?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/react-native-community',
        html_url: 'https://github.com/react-native-community',
        followers_url:
          'https://api.github.com/users/react-native-community/followers',
        following_url:
          'https://api.github.com/users/react-native-community/following{/other_user}',
        gists_url:
          'https://api.github.com/users/react-native-community/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/react-native-community/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/react-native-community/subscriptions',
        organizations_url:
          'https://api.github.com/users/react-native-community/orgs',
        repos_url: 'https://api.github.com/users/react-native-community/repos',
        events_url:
          'https://api.github.com/users/react-native-community/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/react-native-community/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/react-native-community/react-native-camera',
      description:
        'A Camera component for React Native. Also supports barcode scanning!',
      fork: false,
      url:
        'https://api.github.com/repos/react-native-community/react-native-camera',
      forks_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/forks',
      keys_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/teams',
      hooks_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/hooks',
      issue_events_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/events',
      assignees_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/branches{/branch}',
      tags_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/tags',
      blobs_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/languages',
      stargazers_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/stargazers',
      contributors_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/contributors',
      subscribers_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/subscribers',
      subscription_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/subscription',
      commits_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/merges',
      archive_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/downloads',
      issues_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/labels{/name}',
      releases_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/react-native-community/react-native-camera/deployments',
    },
    url: 'https://api.github.com/notifications/threads/151305359',
    subscription_url:
      'https://api.github.com/notifications/threads/151305359/subscription',
  },
  {
    id: '290554932',
    unread: false,
    reason: 'assign',
    updated_at: '2018-01-05T12:18:34Z',
    last_read_at: '2018-01-05T15:22:59Z',
    subject: {
      title: 'Performance updates',
      url: 'https://api.github.com/repos/adeelraza/MinderNative/issues/704',
      latest_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/704',
      type: 'Issue',
    },
    repository: {
      id: 45067132,
      name: 'MinderNative',
      full_name: 'adeelraza/MinderNative',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/MinderNative',
      description: 'React Native Minder App',
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/MinderNative',
      forks_url: 'https://api.github.com/repos/adeelraza/MinderNative/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/MinderNative/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/MinderNative/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/MinderNative/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/MinderNative/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/events{/number}',
      events_url: 'https://api.github.com/repos/adeelraza/MinderNative/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/MinderNative/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/MinderNative/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/MinderNative/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/MinderNative/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/MinderNative/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/adeelraza/MinderNative/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/MinderNative/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/MinderNative/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/MinderNative/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/MinderNative/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/MinderNative/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/MinderNative/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/MinderNative/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/deployments',
    },
    url: 'https://api.github.com/notifications/threads/290554932',
    subscription_url:
      'https://api.github.com/notifications/threads/290554932/subscription',
  },
  {
    id: '168593107',
    unread: false,
    reason: 'mention',
    updated_at: '2018-01-05T12:08:03Z',
    last_read_at: '2018-01-05T15:22:58Z',
    subject: {
      title: 'TextInput cursor is not in the middle when textAlign is center',
      url: 'https://api.github.com/repos/facebook/react-native/issues/10030',
      latest_comment_url:
        'https://api.github.com/repos/facebook/react-native/issues/comments/355540387',
      type: 'Issue',
    },
    repository: {
      id: 29028775,
      name: 'react-native',
      full_name: 'facebook/react-native',
      owner: {
        login: 'facebook',
        id: 69631,
        avatar_url: 'https://avatars3.githubusercontent.com/u/69631?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/facebook',
        html_url: 'https://github.com/facebook',
        followers_url: 'https://api.github.com/users/facebook/followers',
        following_url:
          'https://api.github.com/users/facebook/following{/other_user}',
        gists_url: 'https://api.github.com/users/facebook/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/facebook/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/facebook/subscriptions',
        organizations_url: 'https://api.github.com/users/facebook/orgs',
        repos_url: 'https://api.github.com/users/facebook/repos',
        events_url: 'https://api.github.com/users/facebook/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/facebook/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/facebook/react-native',
      description: 'A framework for building native apps with React.',
      fork: false,
      url: 'https://api.github.com/repos/facebook/react-native',
      forks_url: 'https://api.github.com/repos/facebook/react-native/forks',
      keys_url:
        'https://api.github.com/repos/facebook/react-native/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/facebook/react-native/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/facebook/react-native/teams',
      hooks_url: 'https://api.github.com/repos/facebook/react-native/hooks',
      issue_events_url:
        'https://api.github.com/repos/facebook/react-native/issues/events{/number}',
      events_url: 'https://api.github.com/repos/facebook/react-native/events',
      assignees_url:
        'https://api.github.com/repos/facebook/react-native/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/facebook/react-native/branches{/branch}',
      tags_url: 'https://api.github.com/repos/facebook/react-native/tags',
      blobs_url:
        'https://api.github.com/repos/facebook/react-native/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/facebook/react-native/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/facebook/react-native/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/facebook/react-native/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/facebook/react-native/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/facebook/react-native/languages',
      stargazers_url:
        'https://api.github.com/repos/facebook/react-native/stargazers',
      contributors_url:
        'https://api.github.com/repos/facebook/react-native/contributors',
      subscribers_url:
        'https://api.github.com/repos/facebook/react-native/subscribers',
      subscription_url:
        'https://api.github.com/repos/facebook/react-native/subscription',
      commits_url:
        'https://api.github.com/repos/facebook/react-native/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/facebook/react-native/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/facebook/react-native/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/facebook/react-native/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/facebook/react-native/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/facebook/react-native/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/facebook/react-native/merges',
      archive_url:
        'https://api.github.com/repos/facebook/react-native/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/facebook/react-native/downloads',
      issues_url:
        'https://api.github.com/repos/facebook/react-native/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/facebook/react-native/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/facebook/react-native/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/facebook/react-native/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/facebook/react-native/labels{/name}',
      releases_url:
        'https://api.github.com/repos/facebook/react-native/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/facebook/react-native/deployments',
    },
    url: 'https://api.github.com/notifications/threads/168593107',
    subscription_url:
      'https://api.github.com/notifications/threads/168593107/subscription',
  },
  {
    id: '258930365',
    unread: false,
    reason: 'comment',
    updated_at: '2018-01-05T06:04:25Z',
    last_read_at: '2018-01-05T14:31:31Z',
    subject: {
      title: '`Picker` component performance issues on iOS with larger items',
      url: 'https://api.github.com/repos/GeekyAnts/NativeBase/issues/1239',
      latest_comment_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/issues/1239',
      type: 'Issue',
    },
    repository: {
      id: 56315715,
      name: 'NativeBase',
      full_name: 'GeekyAnts/NativeBase',
      owner: {
        login: 'GeekyAnts',
        id: 18482943,
        avatar_url: 'https://avatars0.githubusercontent.com/u/18482943?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/GeekyAnts',
        html_url: 'https://github.com/GeekyAnts',
        followers_url: 'https://api.github.com/users/GeekyAnts/followers',
        following_url:
          'https://api.github.com/users/GeekyAnts/following{/other_user}',
        gists_url: 'https://api.github.com/users/GeekyAnts/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/GeekyAnts/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/GeekyAnts/subscriptions',
        organizations_url: 'https://api.github.com/users/GeekyAnts/orgs',
        repos_url: 'https://api.github.com/users/GeekyAnts/repos',
        events_url: 'https://api.github.com/users/GeekyAnts/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/GeekyAnts/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/GeekyAnts/NativeBase',
      description: 'Essential cross-platform UI components for React Native',
      fork: false,
      url: 'https://api.github.com/repos/GeekyAnts/NativeBase',
      forks_url: 'https://api.github.com/repos/GeekyAnts/NativeBase/forks',
      keys_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/GeekyAnts/NativeBase/teams',
      hooks_url: 'https://api.github.com/repos/GeekyAnts/NativeBase/hooks',
      issue_events_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/issues/events{/number}',
      events_url: 'https://api.github.com/repos/GeekyAnts/NativeBase/events',
      assignees_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/branches{/branch}',
      tags_url: 'https://api.github.com/repos/GeekyAnts/NativeBase/tags',
      blobs_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/languages',
      stargazers_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/stargazers',
      contributors_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/contributors',
      subscribers_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/subscribers',
      subscription_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/subscription',
      commits_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/GeekyAnts/NativeBase/merges',
      archive_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/downloads',
      issues_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/labels{/name}',
      releases_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/GeekyAnts/NativeBase/deployments',
    },
    url: 'https://api.github.com/notifications/threads/258930365',
    subscription_url:
      'https://api.github.com/notifications/threads/258930365/subscription',
  },
  {
    id: '203816969',
    unread: false,
    reason: 'comment',
    updated_at: '2018-01-05T03:14:16Z',
    last_read_at: '2018-01-05T15:22:57Z',
    subject: {
      title:
        "[Android] position: absolute shouldn't be cut off within a container with border",
      url: 'https://api.github.com/repos/facebook/react-native/issues/12534',
      latest_comment_url:
        'https://api.github.com/repos/facebook/react-native/issues/comments/355462500',
      type: 'Issue',
    },
    repository: {
      id: 29028775,
      name: 'react-native',
      full_name: 'facebook/react-native',
      owner: {
        login: 'facebook',
        id: 69631,
        avatar_url: 'https://avatars3.githubusercontent.com/u/69631?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/facebook',
        html_url: 'https://github.com/facebook',
        followers_url: 'https://api.github.com/users/facebook/followers',
        following_url:
          'https://api.github.com/users/facebook/following{/other_user}',
        gists_url: 'https://api.github.com/users/facebook/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/facebook/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/facebook/subscriptions',
        organizations_url: 'https://api.github.com/users/facebook/orgs',
        repos_url: 'https://api.github.com/users/facebook/repos',
        events_url: 'https://api.github.com/users/facebook/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/facebook/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/facebook/react-native',
      description: 'A framework for building native apps with React.',
      fork: false,
      url: 'https://api.github.com/repos/facebook/react-native',
      forks_url: 'https://api.github.com/repos/facebook/react-native/forks',
      keys_url:
        'https://api.github.com/repos/facebook/react-native/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/facebook/react-native/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/facebook/react-native/teams',
      hooks_url: 'https://api.github.com/repos/facebook/react-native/hooks',
      issue_events_url:
        'https://api.github.com/repos/facebook/react-native/issues/events{/number}',
      events_url: 'https://api.github.com/repos/facebook/react-native/events',
      assignees_url:
        'https://api.github.com/repos/facebook/react-native/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/facebook/react-native/branches{/branch}',
      tags_url: 'https://api.github.com/repos/facebook/react-native/tags',
      blobs_url:
        'https://api.github.com/repos/facebook/react-native/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/facebook/react-native/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/facebook/react-native/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/facebook/react-native/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/facebook/react-native/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/facebook/react-native/languages',
      stargazers_url:
        'https://api.github.com/repos/facebook/react-native/stargazers',
      contributors_url:
        'https://api.github.com/repos/facebook/react-native/contributors',
      subscribers_url:
        'https://api.github.com/repos/facebook/react-native/subscribers',
      subscription_url:
        'https://api.github.com/repos/facebook/react-native/subscription',
      commits_url:
        'https://api.github.com/repos/facebook/react-native/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/facebook/react-native/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/facebook/react-native/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/facebook/react-native/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/facebook/react-native/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/facebook/react-native/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/facebook/react-native/merges',
      archive_url:
        'https://api.github.com/repos/facebook/react-native/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/facebook/react-native/downloads',
      issues_url:
        'https://api.github.com/repos/facebook/react-native/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/facebook/react-native/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/facebook/react-native/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/facebook/react-native/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/facebook/react-native/labels{/name}',
      releases_url:
        'https://api.github.com/repos/facebook/react-native/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/facebook/react-native/deployments',
    },
    url: 'https://api.github.com/notifications/threads/203816969',
    subscription_url:
      'https://api.github.com/notifications/threads/203816969/subscription',
  },
  {
    id: '276213645',
    unread: false,
    reason: 'review_requested',
    updated_at: '2018-01-05T01:32:39Z',
    last_read_at: '2018-01-05T01:55:28Z',
    subject: {
      title: 'Responsiveness score',
      url: 'https://api.github.com/repos/adeelraza/minder-express/pulls/111',
      latest_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls/111',
      type: 'PullRequest',
    },
    repository: {
      id: 34196773,
      name: 'minder-express',
      full_name: 'adeelraza/minder-express',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/minder-express',
      description: null,
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/minder-express',
      forks_url: 'https://api.github.com/repos/adeelraza/minder-express/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/minder-express/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/minder-express/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/minder-express/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/minder-express/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/adeelraza/minder-express/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/minder-express/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/minder-express/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/minder-express/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/minder-express/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/minder-express/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/minder-express/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/minder-express/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/minder-express/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/minder-express/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/minder-express/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/adeelraza/minder-express/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/minder-express/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/minder-express/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/minder-express/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/minder-express/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/minder-express/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/minder-express/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/minder-express/deployments',
    },
    url: 'https://api.github.com/notifications/threads/276213645',
    subscription_url:
      'https://api.github.com/notifications/threads/276213645/subscription',
  },
  {
    id: '289548015',
    unread: false,
    reason: 'comment',
    updated_at: '2018-01-05T01:32:39Z',
    last_read_at: '2018-01-05T01:51:37Z',
    subject: {
      title: 'add support for controling online status',
      url: 'https://api.github.com/repos/adeelraza/minder-express/pulls/123',
      latest_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls/123',
      type: 'PullRequest',
    },
    repository: {
      id: 34196773,
      name: 'minder-express',
      full_name: 'adeelraza/minder-express',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/minder-express',
      description: null,
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/minder-express',
      forks_url: 'https://api.github.com/repos/adeelraza/minder-express/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/minder-express/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/minder-express/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/minder-express/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/minder-express/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/adeelraza/minder-express/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/minder-express/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/minder-express/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/minder-express/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/minder-express/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/minder-express/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/minder-express/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/minder-express/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/minder-express/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/minder-express/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/minder-express/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/adeelraza/minder-express/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/minder-express/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/minder-express/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/minder-express/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/minder-express/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/minder-express/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/minder-express/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/minder-express/deployments',
    },
    url: 'https://api.github.com/notifications/threads/289548015',
    subscription_url:
      'https://api.github.com/notifications/threads/289548015/subscription',
  },
  {
    id: '288730084',
    unread: false,
    reason: 'subscribed',
    updated_at: '2018-01-05T01:32:39Z',
    last_read_at: '2018-01-05T17:21:38Z',
    subject: {
      title: 'Safety center admin',
      url: 'https://api.github.com/repos/adeelraza/minder-express/pulls/122',
      latest_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls/122',
      type: 'PullRequest',
    },
    repository: {
      id: 34196773,
      name: 'minder-express',
      full_name: 'adeelraza/minder-express',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/minder-express',
      description: null,
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/minder-express',
      forks_url: 'https://api.github.com/repos/adeelraza/minder-express/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/minder-express/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/minder-express/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/minder-express/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/minder-express/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/adeelraza/minder-express/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/minder-express/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/minder-express/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/minder-express/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/minder-express/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/minder-express/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/minder-express/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/minder-express/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/minder-express/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/minder-express/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/minder-express/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/adeelraza/minder-express/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/minder-express/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/minder-express/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/minder-express/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/minder-express/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/minder-express/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/minder-express/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/minder-express/deployments',
    },
    url: 'https://api.github.com/notifications/threads/288730084',
    subscription_url:
      'https://api.github.com/notifications/threads/288730084/subscription',
  },
  {
    id: '290393739',
    unread: false,
    reason: 'assign',
    updated_at: '2018-01-05T01:32:37Z',
    last_read_at: '2018-01-05T01:51:37Z',
    subject: {
      title: 'Release candidate (without merge accounts)',
      url: 'https://api.github.com/repos/adeelraza/minder-express/pulls/124',
      latest_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls/124',
      type: 'PullRequest',
    },
    repository: {
      id: 34196773,
      name: 'minder-express',
      full_name: 'adeelraza/minder-express',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/minder-express',
      description: null,
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/minder-express',
      forks_url: 'https://api.github.com/repos/adeelraza/minder-express/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/minder-express/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/minder-express/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/minder-express/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/minder-express/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/adeelraza/minder-express/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/minder-express/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/minder-express/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/minder-express/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/minder-express/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/minder-express/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/minder-express/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/minder-express/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/minder-express/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/minder-express/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/minder-express/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/adeelraza/minder-express/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/minder-express/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/minder-express/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/minder-express/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/minder-express/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/minder-express/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/minder-express/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/minder-express/deployments',
    },
    url: 'https://api.github.com/notifications/threads/290393739',
    subscription_url:
      'https://api.github.com/notifications/threads/290393739/subscription',
  },
  {
    id: '282787653',
    unread: false,
    reason: 'assign',
    updated_at: '2018-01-04T22:16:44Z',
    last_read_at: '2018-01-04T22:17:19Z',
    subject: {
      title: 'Release candidate (including merge accounts)',
      url: 'https://api.github.com/repos/adeelraza/minder-express/pulls/115',
      latest_comment_url: null,
      type: 'PullRequest',
    },
    repository: {
      id: 34196773,
      name: 'minder-express',
      full_name: 'adeelraza/minder-express',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/minder-express',
      description: null,
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/minder-express',
      forks_url: 'https://api.github.com/repos/adeelraza/minder-express/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/minder-express/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/minder-express/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/minder-express/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/minder-express/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/adeelraza/minder-express/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/minder-express/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/minder-express/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/minder-express/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/minder-express/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/minder-express/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/minder-express/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/minder-express/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/minder-express/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/minder-express/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/minder-express/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/minder-express/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/minder-express/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/adeelraza/minder-express/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/minder-express/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/minder-express/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/minder-express/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/minder-express/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/minder-express/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/minder-express/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/minder-express/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/minder-express/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/minder-express/deployments',
    },
    url: 'https://api.github.com/notifications/threads/282787653',
    subscription_url:
      'https://api.github.com/notifications/threads/282787653/subscription',
  },
  {
    id: '250407298',
    unread: false,
    reason: 'mention',
    updated_at: '2018-01-04T16:15:36Z',
    last_read_at: '2018-01-04T16:21:13Z',
    subject: {
      title: 'Upgrade for react-native 0.48 & react 16',
      url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/pulls/26',
      latest_comment_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/issues/comments/355324918',
      type: 'PullRequest',
    },
    repository: {
      id: 56429945,
      name: 'react-native-autogrow-textinput',
      full_name: 'wix/react-native-autogrow-textinput',
      owner: {
        login: 'wix',
        id: 686511,
        avatar_url: 'https://avatars1.githubusercontent.com/u/686511?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/wix',
        html_url: 'https://github.com/wix',
        followers_url: 'https://api.github.com/users/wix/followers',
        following_url:
          'https://api.github.com/users/wix/following{/other_user}',
        gists_url: 'https://api.github.com/users/wix/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/wix/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/wix/subscriptions',
        organizations_url: 'https://api.github.com/users/wix/orgs',
        repos_url: 'https://api.github.com/users/wix/repos',
        events_url: 'https://api.github.com/users/wix/events{/privacy}',
        received_events_url: 'https://api.github.com/users/wix/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/wix/react-native-autogrow-textinput',
      description: null,
      fork: false,
      url: 'https://api.github.com/repos/wix/react-native-autogrow-textinput',
      forks_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/forks',
      keys_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/teams',
      hooks_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/hooks',
      issue_events_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/events',
      assignees_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/branches{/branch}',
      tags_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/tags',
      blobs_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/languages',
      stargazers_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/stargazers',
      contributors_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/contributors',
      subscribers_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/subscribers',
      subscription_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/subscription',
      commits_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/merges',
      archive_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/downloads',
      issues_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/labels{/name}',
      releases_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/wix/react-native-autogrow-textinput/deployments',
    },
    url: 'https://api.github.com/notifications/threads/250407298',
    subscription_url:
      'https://api.github.com/notifications/threads/250407298/subscription',
  },
  {
    id: '235409674',
    unread: false,
    reason: 'comment',
    updated_at: '2018-01-04T03:10:46Z',
    last_read_at: '2018-01-04T15:19:29Z',
    subject: {
      title: 'Cropping photo - Should to save quality  when scaled (Android)',
      url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/issues/354',
      latest_comment_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/issues/comments/355188709',
      type: 'Issue',
    },
    repository: {
      id: 59029620,
      name: 'react-native-image-crop-picker',
      full_name: 'ivpusic/react-native-image-crop-picker',
      owner: {
        login: 'ivpusic',
        id: 450140,
        avatar_url: 'https://avatars0.githubusercontent.com/u/450140?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/ivpusic',
        html_url: 'https://github.com/ivpusic',
        followers_url: 'https://api.github.com/users/ivpusic/followers',
        following_url:
          'https://api.github.com/users/ivpusic/following{/other_user}',
        gists_url: 'https://api.github.com/users/ivpusic/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/ivpusic/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/ivpusic/subscriptions',
        organizations_url: 'https://api.github.com/users/ivpusic/orgs',
        repos_url: 'https://api.github.com/users/ivpusic/repos',
        events_url: 'https://api.github.com/users/ivpusic/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/ivpusic/received_events',
        type: 'User',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/ivpusic/react-native-image-crop-picker',
      description:
        'iOS/Android image picker with support for camera, configurable compression, multiple images and cropping',
      fork: false,
      url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker',
      forks_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/forks',
      keys_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/teams',
      hooks_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/hooks',
      issue_events_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/events',
      assignees_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/branches{/branch}',
      tags_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/tags',
      blobs_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/languages',
      stargazers_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/stargazers',
      contributors_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/contributors',
      subscribers_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/subscribers',
      subscription_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/subscription',
      commits_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/merges',
      archive_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/downloads',
      issues_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/labels{/name}',
      releases_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/ivpusic/react-native-image-crop-picker/deployments',
    },
    url: 'https://api.github.com/notifications/threads/235409674',
    subscription_url:
      'https://api.github.com/notifications/threads/235409674/subscription',
  },
  {
    id: '264858490',
    unread: false,
    reason: 'comment',
    updated_at: '2018-01-04T11:41:33Z',
    last_read_at: '2018-01-03T17:56:25Z',
    subject: {
      title: 'Setting a subtitle narrows title space in nav-bar',
      url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/1993',
      latest_comment_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/1993',
      type: 'Issue',
    },
    repository: {
      id: 53662249,
      name: 'react-native-navigation',
      full_name: 'wix/react-native-navigation',
      owner: {
        login: 'wix',
        id: 686511,
        avatar_url: 'https://avatars1.githubusercontent.com/u/686511?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/wix',
        html_url: 'https://github.com/wix',
        followers_url: 'https://api.github.com/users/wix/followers',
        following_url:
          'https://api.github.com/users/wix/following{/other_user}',
        gists_url: 'https://api.github.com/users/wix/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/wix/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/wix/subscriptions',
        organizations_url: 'https://api.github.com/users/wix/orgs',
        repos_url: 'https://api.github.com/users/wix/repos',
        events_url: 'https://api.github.com/users/wix/events{/privacy}',
        received_events_url: 'https://api.github.com/users/wix/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/wix/react-native-navigation',
      description: 'A complete native navigation solution for React Native',
      fork: false,
      url: 'https://api.github.com/repos/wix/react-native-navigation',
      forks_url:
        'https://api.github.com/repos/wix/react-native-navigation/forks',
      keys_url:
        'https://api.github.com/repos/wix/react-native-navigation/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/wix/react-native-navigation/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/wix/react-native-navigation/teams',
      hooks_url:
        'https://api.github.com/repos/wix/react-native-navigation/hooks',
      issue_events_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/wix/react-native-navigation/events',
      assignees_url:
        'https://api.github.com/repos/wix/react-native-navigation/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/wix/react-native-navigation/branches{/branch}',
      tags_url: 'https://api.github.com/repos/wix/react-native-navigation/tags',
      blobs_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/wix/react-native-navigation/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/wix/react-native-navigation/languages',
      stargazers_url:
        'https://api.github.com/repos/wix/react-native-navigation/stargazers',
      contributors_url:
        'https://api.github.com/repos/wix/react-native-navigation/contributors',
      subscribers_url:
        'https://api.github.com/repos/wix/react-native-navigation/subscribers',
      subscription_url:
        'https://api.github.com/repos/wix/react-native-navigation/subscription',
      commits_url:
        'https://api.github.com/repos/wix/react-native-navigation/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/wix/react-native-navigation/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/wix/react-native-navigation/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/wix/react-native-navigation/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/wix/react-native-navigation/merges',
      archive_url:
        'https://api.github.com/repos/wix/react-native-navigation/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/wix/react-native-navigation/downloads',
      issues_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/wix/react-native-navigation/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/wix/react-native-navigation/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/wix/react-native-navigation/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/wix/react-native-navigation/labels{/name}',
      releases_url:
        'https://api.github.com/repos/wix/react-native-navigation/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/wix/react-native-navigation/deployments',
    },
    url: 'https://api.github.com/notifications/threads/264858490',
    subscription_url:
      'https://api.github.com/notifications/threads/264858490/subscription',
  },
  {
    id: '145031465',
    unread: false,
    reason: 'mention',
    updated_at: '2018-01-03T15:14:25Z',
    last_read_at: '2018-01-03T16:00:49Z',
    subject: {
      title: 'NavigatorButtons icon use react-native-icons?',
      url: 'https://api.github.com/repos/wix/react-native-navigation/issues/43',
      latest_comment_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/comments/355036323',
      type: 'Issue',
    },
    repository: {
      id: 53662249,
      name: 'react-native-navigation',
      full_name: 'wix/react-native-navigation',
      owner: {
        login: 'wix',
        id: 686511,
        avatar_url: 'https://avatars1.githubusercontent.com/u/686511?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/wix',
        html_url: 'https://github.com/wix',
        followers_url: 'https://api.github.com/users/wix/followers',
        following_url:
          'https://api.github.com/users/wix/following{/other_user}',
        gists_url: 'https://api.github.com/users/wix/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/wix/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/wix/subscriptions',
        organizations_url: 'https://api.github.com/users/wix/orgs',
        repos_url: 'https://api.github.com/users/wix/repos',
        events_url: 'https://api.github.com/users/wix/events{/privacy}',
        received_events_url: 'https://api.github.com/users/wix/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/wix/react-native-navigation',
      description: 'A complete native navigation solution for React Native',
      fork: false,
      url: 'https://api.github.com/repos/wix/react-native-navigation',
      forks_url:
        'https://api.github.com/repos/wix/react-native-navigation/forks',
      keys_url:
        'https://api.github.com/repos/wix/react-native-navigation/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/wix/react-native-navigation/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/wix/react-native-navigation/teams',
      hooks_url:
        'https://api.github.com/repos/wix/react-native-navigation/hooks',
      issue_events_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/wix/react-native-navigation/events',
      assignees_url:
        'https://api.github.com/repos/wix/react-native-navigation/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/wix/react-native-navigation/branches{/branch}',
      tags_url: 'https://api.github.com/repos/wix/react-native-navigation/tags',
      blobs_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/wix/react-native-navigation/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/wix/react-native-navigation/languages',
      stargazers_url:
        'https://api.github.com/repos/wix/react-native-navigation/stargazers',
      contributors_url:
        'https://api.github.com/repos/wix/react-native-navigation/contributors',
      subscribers_url:
        'https://api.github.com/repos/wix/react-native-navigation/subscribers',
      subscription_url:
        'https://api.github.com/repos/wix/react-native-navigation/subscription',
      commits_url:
        'https://api.github.com/repos/wix/react-native-navigation/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/wix/react-native-navigation/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/wix/react-native-navigation/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/wix/react-native-navigation/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/wix/react-native-navigation/merges',
      archive_url:
        'https://api.github.com/repos/wix/react-native-navigation/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/wix/react-native-navigation/downloads',
      issues_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/wix/react-native-navigation/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/wix/react-native-navigation/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/wix/react-native-navigation/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/wix/react-native-navigation/labels{/name}',
      releases_url:
        'https://api.github.com/repos/wix/react-native-navigation/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/wix/react-native-navigation/deployments',
    },
    url: 'https://api.github.com/notifications/threads/145031465',
    subscription_url:
      'https://api.github.com/notifications/threads/145031465/subscription',
  },
  {
    id: '273040204',
    unread: false,
    reason: 'comment',
    updated_at: '2018-01-03T03:33:23Z',
    last_read_at: '2018-01-03T16:00:50Z',
    subject: {
      title: 'RN 50 support?',
      url:
        'https://api.github.com/repos/react-native-community/react-native-svg/issues/495',
      latest_comment_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/issues/comments/354931561',
      type: 'Issue',
    },
    repository: {
      id: 49820627,
      name: 'react-native-svg',
      full_name: 'react-native-community/react-native-svg',
      owner: {
        login: 'react-native-community',
        id: 20269980,
        avatar_url: 'https://avatars1.githubusercontent.com/u/20269980?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/react-native-community',
        html_url: 'https://github.com/react-native-community',
        followers_url:
          'https://api.github.com/users/react-native-community/followers',
        following_url:
          'https://api.github.com/users/react-native-community/following{/other_user}',
        gists_url:
          'https://api.github.com/users/react-native-community/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/react-native-community/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/react-native-community/subscriptions',
        organizations_url:
          'https://api.github.com/users/react-native-community/orgs',
        repos_url: 'https://api.github.com/users/react-native-community/repos',
        events_url:
          'https://api.github.com/users/react-native-community/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/react-native-community/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/react-native-community/react-native-svg',
      description: 'SVG library for React Native.',
      fork: false,
      url:
        'https://api.github.com/repos/react-native-community/react-native-svg',
      forks_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/forks',
      keys_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/teams',
      hooks_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/hooks',
      issue_events_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/events',
      assignees_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/branches{/branch}',
      tags_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/tags',
      blobs_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/languages',
      stargazers_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/stargazers',
      contributors_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/contributors',
      subscribers_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/subscribers',
      subscription_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/subscription',
      commits_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/merges',
      archive_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/downloads',
      issues_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/labels{/name}',
      releases_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/react-native-community/react-native-svg/deployments',
    },
    url: 'https://api.github.com/notifications/threads/273040204',
    subscription_url:
      'https://api.github.com/notifications/threads/273040204/subscription',
  },
  {
    id: '240942539',
    unread: false,
    reason: 'mention',
    updated_at: '2018-01-02T17:54:50Z',
    last_read_at: '2018-01-02T20:13:17Z',
    subject: {
      title:
        'TypeError: global.nativeTraceBeginSection is not a function (Systrace)',
      url: 'https://api.github.com/repos/facebook/react-native/issues/15003',
      latest_comment_url:
        'https://api.github.com/repos/facebook/react-native/issues/comments/354830529',
      type: 'Issue',
    },
    repository: {
      id: 29028775,
      name: 'react-native',
      full_name: 'facebook/react-native',
      owner: {
        login: 'facebook',
        id: 69631,
        avatar_url: 'https://avatars3.githubusercontent.com/u/69631?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/facebook',
        html_url: 'https://github.com/facebook',
        followers_url: 'https://api.github.com/users/facebook/followers',
        following_url:
          'https://api.github.com/users/facebook/following{/other_user}',
        gists_url: 'https://api.github.com/users/facebook/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/facebook/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/facebook/subscriptions',
        organizations_url: 'https://api.github.com/users/facebook/orgs',
        repos_url: 'https://api.github.com/users/facebook/repos',
        events_url: 'https://api.github.com/users/facebook/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/facebook/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/facebook/react-native',
      description: 'A framework for building native apps with React.',
      fork: false,
      url: 'https://api.github.com/repos/facebook/react-native',
      forks_url: 'https://api.github.com/repos/facebook/react-native/forks',
      keys_url:
        'https://api.github.com/repos/facebook/react-native/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/facebook/react-native/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/facebook/react-native/teams',
      hooks_url: 'https://api.github.com/repos/facebook/react-native/hooks',
      issue_events_url:
        'https://api.github.com/repos/facebook/react-native/issues/events{/number}',
      events_url: 'https://api.github.com/repos/facebook/react-native/events',
      assignees_url:
        'https://api.github.com/repos/facebook/react-native/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/facebook/react-native/branches{/branch}',
      tags_url: 'https://api.github.com/repos/facebook/react-native/tags',
      blobs_url:
        'https://api.github.com/repos/facebook/react-native/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/facebook/react-native/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/facebook/react-native/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/facebook/react-native/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/facebook/react-native/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/facebook/react-native/languages',
      stargazers_url:
        'https://api.github.com/repos/facebook/react-native/stargazers',
      contributors_url:
        'https://api.github.com/repos/facebook/react-native/contributors',
      subscribers_url:
        'https://api.github.com/repos/facebook/react-native/subscribers',
      subscription_url:
        'https://api.github.com/repos/facebook/react-native/subscription',
      commits_url:
        'https://api.github.com/repos/facebook/react-native/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/facebook/react-native/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/facebook/react-native/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/facebook/react-native/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/facebook/react-native/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/facebook/react-native/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/facebook/react-native/merges',
      archive_url:
        'https://api.github.com/repos/facebook/react-native/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/facebook/react-native/downloads',
      issues_url:
        'https://api.github.com/repos/facebook/react-native/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/facebook/react-native/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/facebook/react-native/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/facebook/react-native/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/facebook/react-native/labels{/name}',
      releases_url:
        'https://api.github.com/repos/facebook/react-native/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/facebook/react-native/deployments',
    },
    url: 'https://api.github.com/notifications/threads/240942539',
    subscription_url:
      'https://api.github.com/notifications/threads/240942539/subscription',
  },
  {
    id: '277594528',
    unread: false,
    reason: 'comment',
    updated_at: '2018-01-02T15:18:14Z',
    last_read_at: '2018-01-02T20:13:19Z',
    subject: {
      title: 'Immutable error when passing appStyle [iOS]',
      url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/2182',
      latest_comment_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/comments/354788931',
      type: 'Issue',
    },
    repository: {
      id: 53662249,
      name: 'react-native-navigation',
      full_name: 'wix/react-native-navigation',
      owner: {
        login: 'wix',
        id: 686511,
        avatar_url: 'https://avatars1.githubusercontent.com/u/686511?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/wix',
        html_url: 'https://github.com/wix',
        followers_url: 'https://api.github.com/users/wix/followers',
        following_url:
          'https://api.github.com/users/wix/following{/other_user}',
        gists_url: 'https://api.github.com/users/wix/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/wix/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/wix/subscriptions',
        organizations_url: 'https://api.github.com/users/wix/orgs',
        repos_url: 'https://api.github.com/users/wix/repos',
        events_url: 'https://api.github.com/users/wix/events{/privacy}',
        received_events_url: 'https://api.github.com/users/wix/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/wix/react-native-navigation',
      description: 'A complete native navigation solution for React Native',
      fork: false,
      url: 'https://api.github.com/repos/wix/react-native-navigation',
      forks_url:
        'https://api.github.com/repos/wix/react-native-navigation/forks',
      keys_url:
        'https://api.github.com/repos/wix/react-native-navigation/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/wix/react-native-navigation/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/wix/react-native-navigation/teams',
      hooks_url:
        'https://api.github.com/repos/wix/react-native-navigation/hooks',
      issue_events_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/wix/react-native-navigation/events',
      assignees_url:
        'https://api.github.com/repos/wix/react-native-navigation/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/wix/react-native-navigation/branches{/branch}',
      tags_url: 'https://api.github.com/repos/wix/react-native-navigation/tags',
      blobs_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/wix/react-native-navigation/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/wix/react-native-navigation/languages',
      stargazers_url:
        'https://api.github.com/repos/wix/react-native-navigation/stargazers',
      contributors_url:
        'https://api.github.com/repos/wix/react-native-navigation/contributors',
      subscribers_url:
        'https://api.github.com/repos/wix/react-native-navigation/subscribers',
      subscription_url:
        'https://api.github.com/repos/wix/react-native-navigation/subscription',
      commits_url:
        'https://api.github.com/repos/wix/react-native-navigation/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/wix/react-native-navigation/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/wix/react-native-navigation/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/wix/react-native-navigation/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/wix/react-native-navigation/merges',
      archive_url:
        'https://api.github.com/repos/wix/react-native-navigation/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/wix/react-native-navigation/downloads',
      issues_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/wix/react-native-navigation/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/wix/react-native-navigation/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/wix/react-native-navigation/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/wix/react-native-navigation/labels{/name}',
      releases_url:
        'https://api.github.com/repos/wix/react-native-navigation/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/wix/react-native-navigation/deployments',
    },
    url: 'https://api.github.com/notifications/threads/277594528',
    subscription_url:
      'https://api.github.com/notifications/threads/277594528/subscription',
  },
  {
    id: '289543713',
    unread: false,
    reason: 'subscribed',
    updated_at: '2018-01-03T19:38:32Z',
    last_read_at: '2018-01-04T16:46:25Z',
    subject: {
      title: "Add ability to hide online status, but you can't see others",
      url: 'https://api.github.com/repos/adeelraza/MinderNative/pulls/701',
      latest_comment_url: null,
      type: 'PullRequest',
    },
    repository: {
      id: 45067132,
      name: 'MinderNative',
      full_name: 'adeelraza/MinderNative',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/MinderNative',
      description: 'React Native Minder App',
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/MinderNative',
      forks_url: 'https://api.github.com/repos/adeelraza/MinderNative/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/MinderNative/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/MinderNative/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/MinderNative/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/MinderNative/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/events{/number}',
      events_url: 'https://api.github.com/repos/adeelraza/MinderNative/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/MinderNative/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/MinderNative/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/MinderNative/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/MinderNative/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/MinderNative/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/adeelraza/MinderNative/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/MinderNative/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/MinderNative/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/MinderNative/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/MinderNative/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/MinderNative/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/MinderNative/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/MinderNative/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/deployments',
    },
    url: 'https://api.github.com/notifications/threads/289543713',
    subscription_url:
      'https://api.github.com/notifications/threads/289543713/subscription',
  },
  {
    id: '289544456',
    unread: false,
    reason: 'subscribed',
    updated_at: '2018-01-02T11:37:45Z',
    last_read_at: '2018-01-02T20:13:22Z',
    subject: {
      title: 'In-App Push Notifications (note by Adeel)',
      url: 'https://api.github.com/repos/adeelraza/MinderNative/issues/702',
      latest_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/702',
      type: 'Issue',
    },
    repository: {
      id: 45067132,
      name: 'MinderNative',
      full_name: 'adeelraza/MinderNative',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/MinderNative',
      description: 'React Native Minder App',
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/MinderNative',
      forks_url: 'https://api.github.com/repos/adeelraza/MinderNative/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/MinderNative/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/MinderNative/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/MinderNative/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/MinderNative/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/events{/number}',
      events_url: 'https://api.github.com/repos/adeelraza/MinderNative/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/MinderNative/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/MinderNative/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/MinderNative/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/MinderNative/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/MinderNative/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/adeelraza/MinderNative/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/MinderNative/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/MinderNative/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/MinderNative/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/MinderNative/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/MinderNative/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/MinderNative/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/MinderNative/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/deployments',
    },
    url: 'https://api.github.com/notifications/threads/289544456',
    subscription_url:
      'https://api.github.com/notifications/threads/289544456/subscription',
  },
  {
    id: '289431717',
    unread: false,
    reason: 'mention',
    updated_at: '2018-01-03T16:49:22Z',
    last_read_at: '2018-01-04T16:46:48Z',
    subject: {
      title:
        'Disable viewing profile and online indicator of **unmatched** users',
      url: 'https://api.github.com/repos/adeelraza/MinderNative/pulls/700',
      latest_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/pulls/700',
      type: 'PullRequest',
    },
    repository: {
      id: 45067132,
      name: 'MinderNative',
      full_name: 'adeelraza/MinderNative',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/MinderNative',
      description: 'React Native Minder App',
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/MinderNative',
      forks_url: 'https://api.github.com/repos/adeelraza/MinderNative/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/MinderNative/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/MinderNative/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/MinderNative/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/MinderNative/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/events{/number}',
      events_url: 'https://api.github.com/repos/adeelraza/MinderNative/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/MinderNative/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/MinderNative/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/MinderNative/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/MinderNative/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/MinderNative/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/adeelraza/MinderNative/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/MinderNative/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/MinderNative/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/MinderNative/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/MinderNative/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/MinderNative/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/MinderNative/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/MinderNative/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/deployments',
    },
    url: 'https://api.github.com/notifications/threads/289431717',
    subscription_url:
      'https://api.github.com/notifications/threads/289431717/subscription',
  },
  {
    id: '289429300',
    unread: false,
    reason: 'subscribed',
    updated_at: '2018-01-03T16:18:35Z',
    last_read_at: '2018-01-03T16:18:36Z',
    subject: {
      title: '[devtools] Use react-native-debugger instead.',
      url: 'https://api.github.com/repos/adeelraza/MinderNative/pulls/699',
      latest_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/pulls/699',
      type: 'PullRequest',
    },
    repository: {
      id: 45067132,
      name: 'MinderNative',
      full_name: 'adeelraza/MinderNative',
      owner: {
        login: 'adeelraza',
        id: 272548,
        avatar_url: 'https://avatars2.githubusercontent.com/u/272548?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/adeelraza',
        html_url: 'https://github.com/adeelraza',
        followers_url: 'https://api.github.com/users/adeelraza/followers',
        following_url:
          'https://api.github.com/users/adeelraza/following{/other_user}',
        gists_url: 'https://api.github.com/users/adeelraza/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/adeelraza/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/adeelraza/subscriptions',
        organizations_url: 'https://api.github.com/users/adeelraza/orgs',
        repos_url: 'https://api.github.com/users/adeelraza/repos',
        events_url: 'https://api.github.com/users/adeelraza/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/adeelraza/received_events',
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/adeelraza/MinderNative',
      description: 'React Native Minder App',
      fork: false,
      url: 'https://api.github.com/repos/adeelraza/MinderNative',
      forks_url: 'https://api.github.com/repos/adeelraza/MinderNative/forks',
      keys_url:
        'https://api.github.com/repos/adeelraza/MinderNative/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/adeelraza/MinderNative/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/adeelraza/MinderNative/teams',
      hooks_url: 'https://api.github.com/repos/adeelraza/MinderNative/hooks',
      issue_events_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/events{/number}',
      events_url: 'https://api.github.com/repos/adeelraza/MinderNative/events',
      assignees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/adeelraza/MinderNative/branches{/branch}',
      tags_url: 'https://api.github.com/repos/adeelraza/MinderNative/tags',
      blobs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/adeelraza/MinderNative/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/adeelraza/MinderNative/languages',
      stargazers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/stargazers',
      contributors_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contributors',
      subscribers_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscribers',
      subscription_url:
        'https://api.github.com/repos/adeelraza/MinderNative/subscription',
      commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/adeelraza/MinderNative/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/adeelraza/MinderNative/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/adeelraza/MinderNative/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/adeelraza/MinderNative/merges',
      archive_url:
        'https://api.github.com/repos/adeelraza/MinderNative/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/adeelraza/MinderNative/downloads',
      issues_url:
        'https://api.github.com/repos/adeelraza/MinderNative/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/adeelraza/MinderNative/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/adeelraza/MinderNative/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/adeelraza/MinderNative/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/adeelraza/MinderNative/labels{/name}',
      releases_url:
        'https://api.github.com/repos/adeelraza/MinderNative/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/adeelraza/MinderNative/deployments',
    },
    url: 'https://api.github.com/notifications/threads/289429300',
    subscription_url:
      'https://api.github.com/notifications/threads/289429300/subscription',
  },
  {
    id: '256366919',
    unread: false,
    reason: 'comment',
    updated_at: '2017-12-30T00:43:18Z',
    last_read_at: '2017-12-30T05:08:24Z',
    subject: {
      title: '[v2] Fixes issues#1397',
      url:
        'https://api.github.com/repos/wix/react-native-navigation/pulls/1816',
      latest_comment_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/comments/354517586',
      type: 'PullRequest',
    },
    repository: {
      id: 53662249,
      name: 'react-native-navigation',
      full_name: 'wix/react-native-navigation',
      owner: {
        login: 'wix',
        id: 686511,
        avatar_url: 'https://avatars1.githubusercontent.com/u/686511?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/wix',
        html_url: 'https://github.com/wix',
        followers_url: 'https://api.github.com/users/wix/followers',
        following_url:
          'https://api.github.com/users/wix/following{/other_user}',
        gists_url: 'https://api.github.com/users/wix/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/wix/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/wix/subscriptions',
        organizations_url: 'https://api.github.com/users/wix/orgs',
        repos_url: 'https://api.github.com/users/wix/repos',
        events_url: 'https://api.github.com/users/wix/events{/privacy}',
        received_events_url: 'https://api.github.com/users/wix/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/wix/react-native-navigation',
      description: 'A complete native navigation solution for React Native',
      fork: false,
      url: 'https://api.github.com/repos/wix/react-native-navigation',
      forks_url:
        'https://api.github.com/repos/wix/react-native-navigation/forks',
      keys_url:
        'https://api.github.com/repos/wix/react-native-navigation/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/wix/react-native-navigation/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/wix/react-native-navigation/teams',
      hooks_url:
        'https://api.github.com/repos/wix/react-native-navigation/hooks',
      issue_events_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/wix/react-native-navigation/events',
      assignees_url:
        'https://api.github.com/repos/wix/react-native-navigation/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/wix/react-native-navigation/branches{/branch}',
      tags_url: 'https://api.github.com/repos/wix/react-native-navigation/tags',
      blobs_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/wix/react-native-navigation/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/wix/react-native-navigation/languages',
      stargazers_url:
        'https://api.github.com/repos/wix/react-native-navigation/stargazers',
      contributors_url:
        'https://api.github.com/repos/wix/react-native-navigation/contributors',
      subscribers_url:
        'https://api.github.com/repos/wix/react-native-navigation/subscribers',
      subscription_url:
        'https://api.github.com/repos/wix/react-native-navigation/subscription',
      commits_url:
        'https://api.github.com/repos/wix/react-native-navigation/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/wix/react-native-navigation/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/wix/react-native-navigation/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/wix/react-native-navigation/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/wix/react-native-navigation/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/wix/react-native-navigation/merges',
      archive_url:
        'https://api.github.com/repos/wix/react-native-navigation/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/wix/react-native-navigation/downloads',
      issues_url:
        'https://api.github.com/repos/wix/react-native-navigation/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/wix/react-native-navigation/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/wix/react-native-navigation/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/wix/react-native-navigation/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/wix/react-native-navigation/labels{/name}',
      releases_url:
        'https://api.github.com/repos/wix/react-native-navigation/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/wix/react-native-navigation/deployments',
    },
    url: 'https://api.github.com/notifications/threads/256366919',
    subscription_url:
      'https://api.github.com/notifications/threads/256366919/subscription',
  },
  {
    id: '190296715',
    unread: false,
    reason: 'author',
    updated_at: '2017-12-29T17:20:36Z',
    last_read_at: '2017-12-29T19:33:44Z',
    subject: {
      title: 'Support web as a first class citzen',
      url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/issues/367',
      latest_comment_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/issues/comments/354474322',
      type: 'Issue',
    },
    repository: {
      id: 35685034,
      name: 'react-native-vector-icons',
      full_name: 'oblador/react-native-vector-icons',
      owner: {
        login: 'oblador',
        id: 378279,
        avatar_url: 'https://avatars0.githubusercontent.com/u/378279?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/oblador',
        html_url: 'https://github.com/oblador',
        followers_url: 'https://api.github.com/users/oblador/followers',
        following_url:
          'https://api.github.com/users/oblador/following{/other_user}',
        gists_url: 'https://api.github.com/users/oblador/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/oblador/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/oblador/subscriptions',
        organizations_url: 'https://api.github.com/users/oblador/orgs',
        repos_url: 'https://api.github.com/users/oblador/repos',
        events_url: 'https://api.github.com/users/oblador/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/oblador/received_events',
        type: 'User',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/oblador/react-native-vector-icons',
      description:
        'Customizable Icons for React Native with support for NavBar/TabBar/ToolbarAndroid, image source and full styling.',
      fork: false,
      url: 'https://api.github.com/repos/oblador/react-native-vector-icons',
      forks_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/forks',
      keys_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/teams',
      hooks_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/hooks',
      issue_events_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/events',
      assignees_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/branches{/branch}',
      tags_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/tags',
      blobs_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/languages',
      stargazers_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/stargazers',
      contributors_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/contributors',
      subscribers_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/subscribers',
      subscription_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/subscription',
      commits_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/merges',
      archive_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/downloads',
      issues_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/labels{/name}',
      releases_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/oblador/react-native-vector-icons/deployments',
    },
    url: 'https://api.github.com/notifications/threads/190296715',
    subscription_url:
      'https://api.github.com/notifications/threads/190296715/subscription',
  },
  {
    id: '273406311',
    unread: false,
    reason: 'manual',
    updated_at: '2017-12-29T15:32:50Z',
    last_read_at: '2017-12-29T15:48:23Z',
    subject: {
      title: 'Modified for FlatList',
      url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/pulls/629',
      latest_comment_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/issues/comments/354460329',
      type: 'PullRequest',
    },
    repository: {
      id: 46180504,
      name: 'react-native-gifted-chat',
      full_name: 'FaridSafi/react-native-gifted-chat',
      owner: {
        login: 'FaridSafi',
        id: 388375,
        avatar_url: 'https://avatars0.githubusercontent.com/u/388375?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/FaridSafi',
        html_url: 'https://github.com/FaridSafi',
        followers_url: 'https://api.github.com/users/FaridSafi/followers',
        following_url:
          'https://api.github.com/users/FaridSafi/following{/other_user}',
        gists_url: 'https://api.github.com/users/FaridSafi/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/FaridSafi/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/FaridSafi/subscriptions',
        organizations_url: 'https://api.github.com/users/FaridSafi/orgs',
        repos_url: 'https://api.github.com/users/FaridSafi/repos',
        events_url: 'https://api.github.com/users/FaridSafi/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/FaridSafi/received_events',
        type: 'User',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/FaridSafi/react-native-gifted-chat',
      description: '💬 The most complete chat UI for React Native',
      fork: false,
      url: 'https://api.github.com/repos/FaridSafi/react-native-gifted-chat',
      forks_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/forks',
      keys_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/collaborators{/collaborator}',
      teams_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/teams',
      hooks_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/hooks',
      issue_events_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/issues/events{/number}',
      events_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/events',
      assignees_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/branches{/branch}',
      tags_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/tags',
      blobs_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/languages',
      stargazers_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/stargazers',
      contributors_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/contributors',
      subscribers_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/subscribers',
      subscription_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/subscription',
      commits_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/compare/{base}...{head}',
      merges_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/merges',
      archive_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/downloads',
      issues_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/labels{/name}',
      releases_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/FaridSafi/react-native-gifted-chat/deployments',
    },
    url: 'https://api.github.com/notifications/threads/273406311',
    subscription_url:
      'https://api.github.com/notifications/threads/273406311/subscription',
  },
  {
    id: '239884461',
    unread: false,
    reason: 'manual',
    updated_at: '2017-12-28T20:33:51Z',
    last_read_at: '2017-12-29T04:16:42Z',
    subject: {
      title: 'React Native',
      url: 'https://api.github.com/repos/emotion-js/emotion/issues/119',
      latest_comment_url:
        'https://api.github.com/repos/emotion-js/emotion/issues/comments/354354000',
      type: 'Issue',
    },
    repository: {
      id: 92570536,
      name: 'emotion',
      full_name: 'emotion-js/emotion',
      owner: {
        login: 'emotion-js',
        id: 31557565,
        avatar_url: 'https://avatars0.githubusercontent.com/u/31557565?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/emotion-js',
        html_url: 'https://github.com/emotion-js',
        followers_url: 'https://api.github.com/users/emotion-js/followers',
        following_url:
          'https://api.github.com/users/emotion-js/following{/other_user}',
        gists_url: 'https://api.github.com/users/emotion-js/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/emotion-js/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/emotion-js/subscriptions',
        organizations_url: 'https://api.github.com/users/emotion-js/orgs',
        repos_url: 'https://api.github.com/users/emotion-js/repos',
        events_url: 'https://api.github.com/users/emotion-js/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/emotion-js/received_events',
        type: 'Organization',
        site_admin: false,
      },
      private: false,
      html_url: 'https://github.com/emotion-js/emotion',
      description: '⚡️ The Next Generation of CSS-in-JS',
      fork: false,
      url: 'https://api.github.com/repos/emotion-js/emotion',
      forks_url: 'https://api.github.com/repos/emotion-js/emotion/forks',
      keys_url: 'https://api.github.com/repos/emotion-js/emotion/keys{/key_id}',
      collaborators_url:
        'https://api.github.com/repos/emotion-js/emotion/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/emotion-js/emotion/teams',
      hooks_url: 'https://api.github.com/repos/emotion-js/emotion/hooks',
      issue_events_url:
        'https://api.github.com/repos/emotion-js/emotion/issues/events{/number}',
      events_url: 'https://api.github.com/repos/emotion-js/emotion/events',
      assignees_url:
        'https://api.github.com/repos/emotion-js/emotion/assignees{/user}',
      branches_url:
        'https://api.github.com/repos/emotion-js/emotion/branches{/branch}',
      tags_url: 'https://api.github.com/repos/emotion-js/emotion/tags',
      blobs_url:
        'https://api.github.com/repos/emotion-js/emotion/git/blobs{/sha}',
      git_tags_url:
        'https://api.github.com/repos/emotion-js/emotion/git/tags{/sha}',
      git_refs_url:
        'https://api.github.com/repos/emotion-js/emotion/git/refs{/sha}',
      trees_url:
        'https://api.github.com/repos/emotion-js/emotion/git/trees{/sha}',
      statuses_url:
        'https://api.github.com/repos/emotion-js/emotion/statuses/{sha}',
      languages_url:
        'https://api.github.com/repos/emotion-js/emotion/languages',
      stargazers_url:
        'https://api.github.com/repos/emotion-js/emotion/stargazers',
      contributors_url:
        'https://api.github.com/repos/emotion-js/emotion/contributors',
      subscribers_url:
        'https://api.github.com/repos/emotion-js/emotion/subscribers',
      subscription_url:
        'https://api.github.com/repos/emotion-js/emotion/subscription',
      commits_url:
        'https://api.github.com/repos/emotion-js/emotion/commits{/sha}',
      git_commits_url:
        'https://api.github.com/repos/emotion-js/emotion/git/commits{/sha}',
      comments_url:
        'https://api.github.com/repos/emotion-js/emotion/comments{/number}',
      issue_comment_url:
        'https://api.github.com/repos/emotion-js/emotion/issues/comments{/number}',
      contents_url:
        'https://api.github.com/repos/emotion-js/emotion/contents/{+path}',
      compare_url:
        'https://api.github.com/repos/emotion-js/emotion/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/emotion-js/emotion/merges',
      archive_url:
        'https://api.github.com/repos/emotion-js/emotion/{archive_format}{/ref}',
      downloads_url:
        'https://api.github.com/repos/emotion-js/emotion/downloads',
      issues_url:
        'https://api.github.com/repos/emotion-js/emotion/issues{/number}',
      pulls_url:
        'https://api.github.com/repos/emotion-js/emotion/pulls{/number}',
      milestones_url:
        'https://api.github.com/repos/emotion-js/emotion/milestones{/number}',
      notifications_url:
        'https://api.github.com/repos/emotion-js/emotion/notifications{?since,all,participating}',
      labels_url:
        'https://api.github.com/repos/emotion-js/emotion/labels{/name}',
      releases_url:
        'https://api.github.com/repos/emotion-js/emotion/releases{/id}',
      deployments_url:
        'https://api.github.com/repos/emotion-js/emotion/deployments',
    },
    url: 'https://api.github.com/notifications/threads/239884461',
    subscription_url:
      'https://api.github.com/notifications/threads/239884461/subscription',
  },
]
