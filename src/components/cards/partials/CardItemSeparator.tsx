import React, { PureComponent } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { ThemeConsumer } from '../../context/ThemeContext'

const styles = StyleSheet.create({
  separator: {
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 1,
  } as ViewStyle,
})

export class CardItemSeparator extends PureComponent {
  render() {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View
            style={[
              styles.separator,
              { borderBottomColor: theme.backgroundColorMore08 },
            ]}
          />
        )}
      </ThemeConsumer>
    )
  }
}
