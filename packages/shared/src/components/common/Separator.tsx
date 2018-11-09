import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'

import { ThemeConsumer } from '../context/ThemeContext'

const styles = StyleSheet.create({
  horizontalSeparator: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  verticalSeparator: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
  },
})

export interface SeparatorProps {
  horizontal?: boolean
}

export class Separator extends PureComponent<SeparatorProps> {
  render() {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View
            style={[
              this.props.horizontal
                ? styles.horizontalSeparator
                : styles.verticalSeparator,
              { backgroundColor: theme.backgroundColorDarker08 },
            ]}
          />
        )}
      </ThemeConsumer>
    )
  }
}
