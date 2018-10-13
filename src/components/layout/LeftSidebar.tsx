import React, { PureComponent } from 'react'
import { Image, StyleSheet, View } from 'react-native'

import { columnHeaderHeight } from '../columns/ColumnHeader'
import Avatar from '../common/Avatar'
import { ThemeConsumer } from '../context/ThemeContext'

const logo = require('../../../assets/logo.png') // tslint:disable-line

const styles = StyleSheet.create({
  logoContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export class LeftSidebar extends PureComponent {
  render() {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View
            style={{
              width: columnHeaderHeight,
              backgroundColor: theme.backgroundColor,
              borderRightWidth: StyleSheet.hairlineWidth,
              borderRightColor: theme.backgroundColorMore08,
            }}
          >
            <View
              style={[
                styles.logoContainer,
                {
                  backgroundColor: theme.backgroundColorLess08,
                  width: '100%',
                  height: columnHeaderHeight + StyleSheet.hairlineWidth,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor: theme.backgroundColorMore08,
                },
              ]}
            >
              <Avatar
                shape="circle"
                size={columnHeaderHeight / 2}
                username="brunolemos"
              />
            </View>

            <View style={{ flex: 1 }} />

            <View
              style={[
                styles.logoContainer,
                {
                  width: '100%',
                  height: columnHeaderHeight + StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Image
                resizeMode="contain"
                source={logo}
                style={{
                  width: columnHeaderHeight / 2,
                  height: columnHeaderHeight / 2,
                  borderRadius: columnHeaderHeight / (2 * 2),
                }}
              />
            </View>
          </View>
        )}
      </ThemeConsumer>
    )
  }
}
