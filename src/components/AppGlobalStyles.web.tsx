import React from 'react'

import { Theme } from '../styles/utils'
import { ThemeConsumer } from './context/ThemeContext'

function getStyles({ theme }: { theme: Theme }) {
  return `
    ::-webkit-scrollbar-thumb
    {
      background-color: ${theme.backgroundColorMore08};
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
