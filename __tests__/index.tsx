import React from 'react'
import 'react-native'
import reactTestRenderer from 'react-test-renderer'

import App from '../src'

it('renders correctly', () => {
  reactTestRenderer.create(<App />)
})
