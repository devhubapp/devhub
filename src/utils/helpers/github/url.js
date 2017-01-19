// @flow
/* eslint-disable import/prefer-default-export */

import { Linking } from 'react-native';

import { get } from '../../immutable';

import type {
  GithubIssue,
  GithubPullRequest,
  GithubRepo,
} from '../../types';

export const baseURL = 'https://github.com';

export function getCommentIdFromUrl(url: string) {
  if (!url) return null;

  const matches = url.match(/\/comments\/([0-9]+)([?].+)?$/);
  return (matches && matches[1]) || null;
}

export function getCommitShaFromUrl(url: string) {
  if (!url) return null;

  const matches = url.match(/\/commits\/([a-zA-Z0-9]+)([?].+)?$/);
  return (matches && matches[1]) || null;
}

export function getIssueOrPullRequestNumberFromUrl(url: string) {
  if (!url) return null;

  const matches = url.match(/\/(issues|pulls)\/([0-9]+)([?].+)?$/);
  const number = matches && matches[2];

  return parseInt(number, 10) || number || null;
}

/* eslint-disable-next-line no-useless-escape */
export const getRepoFullNameFromUrl = (url: string): string => (
  url
      ? ((url.match(/(github.com\/(repos\/)?)([a-zA-Z0-9\-._]+\/[a-zA-Z0-9\-._]+[^\/#$]?)/i) || [])[3]) || ''
    : ''
);

export const getGitHubURLForUser = (user: string) => (
  user ? `${baseURL}/${user}` : ''
);

const objToQueryParams = obj => Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');

export const getGitHubSearchURL = (queryParams: Object) => (
  queryParams ? `${baseURL}/search?${objToQueryParams(queryParams)}` : ''
);

export const getGitHubURLForBranch = (repoFullName: string, branch: string) => (
  repoFullName && branch ? `${baseURL}/${repoFullName}/tree/${branch}` : ''
);

export function githubHTMLUrlFromAPIUrl(apiURL: string, { number } = {}): string {
  if (!apiURL) return '';

  const [, type, restOfURL] = apiURL.match('api.github.com/([a-zA-Z]+)/(.*)');
  if (!(type && restOfURL)) return '';

  if (type === 'repos') {
    const repoFullName = getRepoFullNameFromUrl(apiURL);
    const [type2, ...restOfURL2] = (apiURL.split(`/repos/${repoFullName}/`)[1] || '').split('/');

    if (restOfURL2[0]) {
      switch (type2) {
        case 'pulls':
          if (restOfURL2[0] === 'comments' && restOfURL2[1]) {
            return number
              ? `${baseURL}/${repoFullName}/pull/${number}/comments#discussion_r${restOfURL2[1]}`
              : '';
          }

          return `${baseURL}/${repoFullName}/pull/${restOfURL2.join('/')}`;

        case 'issues':
          if (restOfURL2[0] === 'comments' && restOfURL2[1]) {
            return number
              ? `${baseURL}/${repoFullName}/pull/${number}/comments#issuecomment-${restOfURL2[1]}`
              : '';
          }

          return `${baseURL}/${repoFullName}/issues/${restOfURL2.join('/')}`;

        case 'commits':
          return `${baseURL}/${repoFullName}/commit/${restOfURL2.join('/')}`;
      }
    }
  }

  return `${baseURL}/${restOfURL}`;
}

function openURL(url: string) {
  if (!url) return null;

  // sometimes the url come like this: '/facebook/react', so we add https://github.com
  let _url = url[0] === '/' && url.indexOf('github.com') < 0 ? `${baseURL}${url}` : url;

  // replace http with devhub:// so the app deeplinking will handle this
  // the app will decide if it will push an app screen or open the web browser
  _url = _url.replace(/(http[s]?)/, 'devhub');

  return Linking.openURL(_url);
}

export function openOnGithub(obj: string | GithubRepo | GithubIssue | GithubPullRequest) {
  if (!obj) return null;

  if (typeof obj === 'string') {
    return openURL(obj);
  }

  const url = get(obj, 'html_url') || get(obj, 'url');
  if (!url) return null;

  return openURL(url);
}
