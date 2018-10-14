import React, { PureComponent } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'

import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import { getOwnerAndRepo } from '../../utils/helpers/github/shared'
import { columnHeaderHeight } from '../columns/ColumnHeader'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import Avatar from '../common/Avatar'
import { ColumnsConsumer } from '../context/ColumnsContext'
import { ThemeConsumer } from '../context/ThemeContext'

const logo = require('../../../assets/logo.png') // tslint:disable-line

const styles = StyleSheet.create({
  centerContainer: {
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
                styles.centerContainer,
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

            <ScrollView style={{ flex: 1 }}>
              <ColumnsConsumer>
                {({ columns }) =>
                  !columns
                    ? null
                    : columns.map((column, index) => {
                        const requestTypeIconAndData = getColumnHeaderDetails({
                          type: column.type,
                          subtype: column.subtype,
                          username: column.username,
                        })

                        return (
                          <View
                            key={`left-sidebar-column-${index}`}
                            style={[
                              styles.centerContainer,
                              {
                                width: '100%',
                                height:
                                  columnHeaderHeight + StyleSheet.hairlineWidth,
                              },
                            ]}
                          >
                            <ColumnHeaderItem
                              iconName={requestTypeIconAndData.icon}
                                showAvatarAsIcon={
                                  requestTypeIconAndData.showAvatarAsIcon
                                }
                              username={
                                column.username &&
                                getOwnerAndRepo(column.username).owner
                              }
                            />
                          </View>
                        )
                      })
                }
              </ColumnsConsumer>
            </ScrollView>

            <View
              style={[
                styles.centerContainer,
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
