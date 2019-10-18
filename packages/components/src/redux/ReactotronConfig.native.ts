import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

import storage from './storage'

export default Reactotron.setAsyncStorageHandler(storage)
  .configure({ name: 'DevHub' })
  .useReactNative()
  .use(reactotronRedux())
  .connect()
