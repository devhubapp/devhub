import React, { PureComponent } from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { emitter } from '../../setup'
import { ExtractPropsFromConnector } from '../../types'
import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import { columnHeaderHeight } from '../columns/ColumnHeader'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Avatar } from '../common/Avatar'
import { Link } from '../common/Link'
import { Separator } from '../common/Separator'
import { ThemeConsumer } from '../context/ThemeContext'

const logo = require('shared/assets/logo.png') // tslint:disable-line

export const sidebarSize = columnHeaderHeight

const styles = StyleSheet.create({
  centerContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export interface SidebarProps {
  horizontal?: boolean
  small?: boolean
}

const connectToStore = connect(
  (state: any) => {
    const user = selectors.currentUserSelector(state)

    return {
      columns: selectors.columnsSelector(state),
      currentOpenedModal: selectors.currentOpenedModal(state),
      username: (user && user.login) || '',
    }
  },
  {
    logout: actions.logout,
    replaceModal: actions.replaceModal,
  },
)

class SidebarComponent extends PureComponent<
  SidebarProps & ExtractPropsFromConnector<typeof connectToStore>
> {
  logout = () => {
    this.props.logout()
  }

  render() {
    const { columns, horizontal, replaceModal, small, username } = this.props

    const squareStyle = {
      width: sidebarSize,
      height: sidebarSize,
    }

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <SafeAreaView
            style={{
              width: horizontal ? undefined : sidebarSize,
              backgroundColor: theme.backgroundColor,
            }}
          >
            <View
              style={{
                flexGrow: 1,
                flexDirection: horizontal ? 'row' : 'column',
                width: horizontal ? undefined : sidebarSize,
                height: horizontal ? sidebarSize : undefined,
              }}
            >
              {!horizontal && (
                <>
                  <View
                    style={[
                      styles.centerContainer,
                      squareStyle,
                      {
                        backgroundColor: theme.backgroundColorLess08,
                      },
                    ]}
                  >
                    <Avatar
                      shape="circle"
                      size={sidebarSize / 2}
                      username={username}
                    />
                  </View>

                  <Separator horizontal />
                </>
              )}

              {!small && (
                <>
                  <TouchableOpacity
                    onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                    style={[styles.centerContainer, squareStyle]}
                  >
                    <ColumnHeaderItem iconName="plus" />
                  </TouchableOpacity>

                  <Separator horizontal />
                </>
              )}

              <ScrollView
                alwaysBounceHorizontal={false}
                alwaysBounceVertical={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent:
                    small && horizontal ? 'space-evenly' : undefined,
                }}
                horizontal={horizontal}
                style={{ flex: 1 }}
              >
                {!columns
                  ? null
                  : columns.map((column, index) => {
                      const requestTypeIconAndData = getColumnHeaderDetails(
                        column,
                      )

                      return (
                        <TouchableOpacity
                          key={`sidebar-column-${column.id}`}
                          style={[styles.centerContainer, squareStyle]}
                          onPress={() => {
                            emitter.emit('FOCUS_ON_COLUMN', {
                              animated:
                                !small || !this.props.currentOpenedModal,
                              columnId: column.id,
                              columnIndex: index,
                              highlight: !small,
                            })
                          }}
                        >
                          <ColumnHeaderItem
                            avatarProps={{
                              ...requestTypeIconAndData.avatarProps,
                              disableLink: true,
                            }}
                            iconName={requestTypeIconAndData.icon}
                          />
                        </TouchableOpacity>
                      )
                    })}

                {!!small && (
                  <TouchableOpacity
                    onPress={() => replaceModal({ name: 'SETTINGS' })}
                    style={[styles.centerContainer, squareStyle]}
                  >
                    <ColumnHeaderItem iconName="gear" />
                  </TouchableOpacity>
                )}
              </ScrollView>

              {!small && (
                <>
                  <Separator horizontal />

                  <TouchableOpacity
                    onPress={() => replaceModal({ name: 'SETTINGS' })}
                    style={[styles.centerContainer, squareStyle]}
                  >
                    <ColumnHeaderItem iconName="gear" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this.logout}
                    style={[
                      styles.centerContainer,
                      squareStyle,
                      {
                        paddingLeft: 3,
                      },
                    ]}
                  >
                    <ColumnHeaderItem iconName="sign-out" />
                  </TouchableOpacity>

                  <Link
                    href="https://twitter.com/brunolemos"
                    openOnNewTab
                    style={[styles.centerContainer, squareStyle]}
                  >
                    <Image
                      resizeMode="contain"
                      source={logo}
                      style={{
                        width: sidebarSize / 2,
                        height: sidebarSize / 2,
                        borderRadius: sidebarSize / (2 * 2),
                      }}
                    />
                  </Link>
                </>
              )}
            </View>
          </SafeAreaView>
        )}
      </ThemeConsumer>
    )
  }
}

export const Sidebar = connectToStore(SidebarComponent)
