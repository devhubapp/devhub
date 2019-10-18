import Reactotron from 'reactotron-react-js'
import { reactotronRedux } from 'reactotron-redux'

export default Reactotron.configure({ name: 'DevHub' })
  .use(reactotronRedux())
  .connect()
