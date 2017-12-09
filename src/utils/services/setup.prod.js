import firebase from '../../libs/firebase'

import Bugsnag from '../../libs/bugsnag'
import pkg from '../../../package.json'

export default () => ({
  bugsnagClient: (() => {
    const bugsnagClient = Bugsnag('231f337f6090422c611017d3dab3d32e')
    bugsnagClient.codeBundleId = pkg.codeBundleId
    return bugsnagClient
  })(),

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
