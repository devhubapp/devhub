import React from 'react'

import { Theme } from 'shared-core/dist/types'
import { ThemeConsumer } from './context/ThemeContext'

function getStyles(params: { theme: Theme }) {
  return `
    ::-webkit-scrollbar-thumb
    {
      background-color: ${params.theme.backgroundColorDarker08};
    }
  `
}

export function AppGlobalStyles() {
  return (
    <ThemeConsumer>
      {({ theme }) => <style>{getStyles({ theme })}</style>}
    </ThemeConsumer>
  )
}
