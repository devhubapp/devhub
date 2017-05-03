// @flow

import React from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';

import { name as appName } from '../../package.json';
import { resetAppDataRequest } from '../actions';
import { resetAppData as resetAppDataDirect } from '../sagas';
import { githubHTMLUrlFromAPIUrl } from '../utils/helpers/github/url';

// TODO: Move this to a better place (probably saga)

const getSchemeAndPathFromURL = url => {
  // no scheme
  if ((url || '').indexOf('://') === -1) {
    return { scheme: null, path: url || '' };
  }

  const [, scheme = null, path = null] = (url || '')
    .match('([^:]+)://(.*)') || [];
  return { path, scheme };
};

const mapDispatchToProps = { resetAppData: resetAppDataRequest };

@connect(null, mapDispatchToProps)
export default class extends React.PureComponent {
  static defaultProps = {
    resetAppData: resetAppDataDirect,
  };

  async componentDidMount() {
    Linking.addEventListener('url', this._handleLinkingEvent);

    const initialURL = await Linking.getInitialURL();
    if (initialURL) this._handleURL(initialURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleLinkingEvent);
  }

  _handleGitHubURL = url => {
    if (!url) return;

    const { scheme, path } = getSchemeAndPathFromURL(url);
    if ((path || '').indexOf('github.com') === -1) return;

    const httpText = scheme === 'http' ? 'http' : 'https';
    const _url = path.indexOf('api.github.com') >= 0
      ? githubHTMLUrlFromAPIUrl(path)
      : `${httpText}://${path}`;

    Linking.openURL(_url);
  };

  _handleDeepLinking = url => {
    console.debug('[DEEP LINK]', url);

    const { path, scheme } = getSchemeAndPathFromURL(url);
    if (scheme !== appName || !path) return;

    switch (path) {
      case 'reset':
        this.props.resetAppData();
        break;

      default:
        break;
    }
  };

  _handleURL = url => {
    const { path, scheme } = getSchemeAndPathFromURL(url);
    if (!path) return;

    if (path.indexOf('github.com') >= 0) {
      this._handleGitHubURL(path);
      return;
    }

    if (scheme === 'http' || scheme === 'https') {
      Linking.openURL(url);
      return;
    }

    this._handleDeepLinking(url);
  };

  _handleLinkingEvent = event => this._handleURL((event || {}).url || '');

  props: {
    children: React.node,
    resetAppData?: Function,
  };

  render = () => this.props.children;
}
