import React, { PureComponent } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { ExtractPropsFromConnector } from '../../types'
import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import { columnHeaderHeight } from '../columns/ColumnHeader'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Avatar } from '../common/Avatar'
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
}

const connectToStore = connect(
  (state: any) => {
    const user = selectors.currentUserSelector(state)

    return {
      columns: selectors.columnsSelector(state),
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
    const { columns, horizontal, replaceModal, username } = this.props

    const squareStyle = {
      width: horizontal ? sidebarSize + StyleSheet.hairlineWidth : '100%',
      height: horizontal ? '100%' : sidebarSize + StyleSheet.hairlineWidth,
    }

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View
            style={{
              flexDirection: horizontal ? 'row' : 'column',
              width: horizontal ? undefined : sidebarSize,
              height: horizontal ? sidebarSize : undefined,
              backgroundColor: theme.backgroundColor,
              borderRightWidth: StyleSheet.hairlineWidth,
              borderRightColor: theme.backgroundColorDarker08,
            }}
          >
            {!horizontal && (
              <View
                style={[
                  styles.centerContainer,
                  {
                    ...squareStyle,
                    backgroundColor: theme.backgroundColorLess08,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: theme.backgroundColorDarker08,
                  },
                ]}
              >
                <Avatar
                  shape="circle"
                  size={sidebarSize / 2}
                  username={username}
                />
              </View>
            )}

            <TouchableOpacity
              onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
              style={[styles.centerContainer, squareStyle]}
            >
              <ColumnHeaderItem iconName="plus" />
            </TouchableOpacity>

            <ScrollView
              alwaysBounceHorizontal={false}
              alwaysBounceVertical={false}
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
                      <View
                        key={`left-sidebar-column-${index}`}
                        style={[styles.centerContainer, squareStyle]}
                      >
                        <ColumnHeaderItem
                          avatarDetails={requestTypeIconAndData.avatarDetails}
                          iconName={requestTypeIconAndData.icon}
                        />
                      </View>
                    )
                  })}
            </ScrollView>

            <TouchableOpacity
              onPress={() => replaceModal({ name: 'SETTINGS' })}
              style={[styles.centerContainer, squareStyle]}
            >
              <ColumnHeaderItem iconName="gear" />
            </TouchableOpacity>

            {!horizontal && (
              <>
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

                <View style={[styles.centerContainer, squareStyle]}>
                  <Image
                    resizeMode="contain"
                    source={logo}
                    style={{
                      width: sidebarSize / 2,
                      height: sidebarSize / 2,
                      borderRadius: sidebarSize / (2 * 2),
                    }}
                  />
                </View>
              </>
            )}
          </View>
        )}
      </ThemeConsumer>
    )
  }
}

export const Sidebar = connectToStore(SidebarComponent)
