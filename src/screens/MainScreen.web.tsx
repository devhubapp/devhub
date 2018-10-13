import React, { PureComponent } from 'react'

import Screen from '../components/common/Screen'
import { ColumnsContainer } from '../containers/ColumnsContainer'

export default class MainScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <ColumnsContainer />
      </Screen>
    )
  }
}
