import React from 'react'

import { init, startMainApp } from './screens'

export async function setup() {
  if (__DEV__) {
    const { whyDidYouUpdate } = require('why-did-you-update')
    whyDidYouUpdate(React, {
      exclude:  /[^a-zA-Z0-9]|CellRenderer|Icon|Swipeable/,
    })
  }

  await init()

  startMainApp()
}
