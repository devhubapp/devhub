import { Linking } from 'react-native';

export * from './helpers.shared';

export const listenForNextUrl = () =>
  new Promise((resolve, reject) => {
    const handleUrl = e => {
      Linking.removeEventListener('url', handleUrl);

      const url = (e || {}).url || '';
      return url ? resolve(url) : reject();
    };

    Linking.addEventListener('url', handleUrl);
    setTimeout(() => Linking.removeEventListener('url', handleUrl), 60 * 1000);
  });
