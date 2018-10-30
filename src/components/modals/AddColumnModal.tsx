import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { ExtractPropsFromConnector, GitHubIcon } from '../../types'
import { ModalColumn } from '../columns/ModalColumn'

import { contentPadding } from '../../styles/variables'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { ThemeConsumer } from '../context/ThemeContext'

interface ColumnType {
  name: string
  icon: GitHubIcon
}

const columnTypes: ColumnType[] = [
  // {
  //   name: 'Notifications',
  //   icon: 'bell',
  // },
  {
    name: 'User Dashboard',
    icon: 'home',
  },
  // {
  //   name: 'User Events',
  //   icon: 'person',
  // },
  // {
  //   name: 'Repo Events',
  //   icon: 'repo',
  // },
  // {
  //   name: 'Org Events',
  //   icon: 'organization',
  // },
  // TODO: add other types
]

const connectToStore = connect(
  (state: any) => ({
    currentOpenedModal: selectors.currentOpenedModal(state),
  }),
  {
    pushModal: actions.pushModal as any, // TODO: fix this shit later
  },
)

class AddColumnModalComponent extends PureComponent<
  ExtractPropsFromConnector<typeof connectToStore>
> {
  render() {
    const { pushModal } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ModalColumn iconName="plus" title="Add Column">
            <ScrollView
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  padding: contentPadding,
                }}
              >
                <Text style={{ color: theme.foregroundColor }}>
                  THIS SCREEN IS A WORK IN PROGRESS.
                </Text>

                {columnTypes.map(columnType => (
                  <TouchableOpacity
                    onPress={() => pushModal('ADD_COLUMN_DETAILS')}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: contentPadding,
                    }}
                  >
                    <ColumnHeaderItem
                      iconName={columnType.icon}
                      iconStyle={{ fontSize: 24, margin: contentPadding / 2 }}
                    />

                    <Text style={{ color: theme.foregroundColor }}>
                      {columnType.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </ModalColumn>
        )}
      </ThemeConsumer>
    )
  }
}

export const AddColumnModal = connectToStore(AddColumnModalComponent)

hoistNonReactStatics(AddColumnModal, AddColumnModalComponent as any)
