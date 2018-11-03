import React, { PureComponent } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { ExtractPropsFromConnector } from '../../types'
import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import { columnHeaderHeight } from '../columns/ColumnHeader'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Avatar } from '../common/Avatar'
import { ThemeConsumer } from '../context/ThemeContext'

const logo = require('../../../assets/logo.png') // tslint:disable-line

export const sidebarSize = columnHeaderHeight

const styles = StyleSheet.create({
  centerContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export interface LeftSidebarProps {
  navigation: NavigationScreenProps['navigation']
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

class LeftSidebarComponent extends PureComponent<
  LeftSidebarProps &
    ExtractPropsFromConnector<typeof connectToStore> &
    NavigationScreenProps
> {
  logout = () => {
    this.props.logout()
  }

  render() {
    const { columns, replaceModal, username } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View
            style={{
              width: sidebarSize,
              backgroundColor: theme.backgroundColor,
              borderRightWidth: StyleSheet.hairlineWidth,
              borderRightColor: theme.backgroundColorDarker08,
            }}
          >
            <View
              style={[
                styles.centerContainer,
                {
                  backgroundColor: theme.backgroundColorLess08,
                  width: '100%',
                  height: sidebarSize + StyleSheet.hairlineWidth,
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

            <TouchableOpacity
              onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
              style={[
                styles.centerContainer,
                {
                  width: '100%',
                  height: sidebarSize + StyleSheet.hairlineWidth,
                },
              ]}
            >
              <ColumnHeaderItem iconName="plus" />
            </TouchableOpacity>

            <ScrollView style={{ flex: 1 }}>
              {!columns
                ? null
                : columns.map((column, index) => {
                    const requestTypeIconAndData = getColumnHeaderDetails(
                      column,
                    )

                    return (
                      <View
                        key={`left-sidebar-column-${index}`}
                        style={[
                          styles.centerContainer,
                          {
                            width: '100%',
                            height: sidebarSize + StyleSheet.hairlineWidth,
                          },
                        ]}
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
              style={[
                styles.centerContainer,
                {
                  width: '100%',
                  height: sidebarSize + StyleSheet.hairlineWidth,
                },
              ]}
            >
              <ColumnHeaderItem iconName="gear" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.logout}
              style={[
                styles.centerContainer,
                {
                  width: '100%',
                  height: sidebarSize + StyleSheet.hairlineWidth,
                  paddingLeft: 3,
                },
              ]}
            >
              <ColumnHeaderItem iconName="sign-out" />
            </TouchableOpacity>

            <View
              style={[
                styles.centerContainer,
                {
                  width: '100%',
                  height: sidebarSize + StyleSheet.hairlineWidth,
                },
              ]}
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
            </View>
          </View>
        )}
      </ThemeConsumer>
    )
  }
}

export const LeftSidebar = connectToStore(LeftSidebarComponent)
