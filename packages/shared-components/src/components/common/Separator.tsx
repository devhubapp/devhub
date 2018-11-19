import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'

import { ThemeConsumer } from '../context/ThemeContext'

export interface SeparatorProps {
  horizontal?: boolean
  thick?: boolean
}

export class Separator extends PureComponent<SeparatorProps> {
  render() {
    const { horizontal, thick } = this.props
    const size = thick ? 2 : StyleSheet.hairlineWidth

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View
            style={[
              horizontal
                ? {
                    width: '100%',
                    height: size,
                  }
                : {
                    width: size,
                    height: '100%',
                  },
              { backgroundColor: theme.backgroundColorDarker08 },
            ]}
          />
        )}
      </ThemeConsumer>
    )
  }
}
