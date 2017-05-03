/* eslint-env browser */

export * from './helpers.shared';

export const listenForNextUrl = () =>
  new Promise((resolve, reject) => {
    const handleMessage = e => {
      const { access_token: accessToken, error } = (e || {}).data || {};
      if (!accessToken && !error) return;

      window.removeEventListener('message', handleMessage);

      if (accessToken) resolve(e.data);
      else reject(error);
    };

    window.addEventListener('message', handleMessage, false);
    setTimeout(
      () => window.removeEventListener('message', handleMessage),
      60 * 1000,
    );
  });
