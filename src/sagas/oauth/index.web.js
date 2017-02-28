/* eslint-env browser */

import qs from 'qs';

import { getUrlParamsIfMatches, listenForNextUrl } from './helpers';

const callbackURL = '';

function popupWindow(url, title, w, h) {
  const left = (screen.width - w) / 2;
  const top = (screen.height - h) / 2;
  return window.open(
    url,
    title,
    `resizable=yes, width=${w}, height=${h}, top=${top}, left=${left}`,
  );
}

export default (async function (serverURL, scopes = []) {
  const scopesStr = (scopes || []).join(' ');
  const querystring = qs.stringify({
    scope: scopesStr,
    callback_url: callbackURL,
    origin: window.location.origin || window.location.href,
  });

  const popup = popupWindow(`${serverURL}/?${querystring}`, 'Login with GitHub', 500, 600);

  try {
    const params = await listenForNextUrl();

    if (!(params || {}).access_token) {
      throw new Error(
        'Login failed: No access token received.',
        'NoAccessTokenException',
      );
    }

    return params;
  } catch (e) {
    popup.close();
    throw e;
  }
});
