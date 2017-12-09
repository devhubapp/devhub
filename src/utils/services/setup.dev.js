import firebase from '../../libs/firebase'

export default () => ({
  bugsnagClient: null,

  firebaseApp:
    firebase.apps.length === 0
      ? firebase.initializeApp({
          apiKey: 'AIzaSyDsTWehKARyK8RKSFCKuVoG_m00j1OGhDQ',
          authDomain: 'devhub-65899.firebaseapp.com',
          databaseURL: 'https://devhub-65899.firebaseio.com',
          storageBucket: 'devhub-65899.appspot.com',
          messagingSenderId: '589579854600',
        })
      : firebase.app(),
})

// // fetch logger
// global._fetch = global.fetch;
// global.fetch = (uri, options, ...args) => (
//   global._fetch(uri, options, ...args).then((response) => {
//     console.log('Fetch', { request: { uri, options, ...args }, response });
//     return response;
//   })
// );

// // chrome network requests
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
