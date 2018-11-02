import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { ColumnType, ExtractPropsFromConnector } from '../../types'
import { ModalColumn } from '../columns/ModalColumn'

import { FlatListProps } from '../../libs/lists/FlatList.web'
import { contentPadding } from '../../styles/variables'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { ThemeConsumer } from '../context/ThemeContext'

const columnTypes: ColumnType[] = [
  {
    name: 'Dashboard',
    icon: 'home',
    column: {
      type: 'activity',
      subtype: 'USER_RECEIVED_EVENTS',
    },
    paramList: ['username'],
  },
  {
    name: 'User',
    icon: 'person',
    column: {
      type: 'activity',
      subtype: 'USER_EVENTS',
    },
    paramList: ['username'],
  },
  {
    name: 'Notifications',
    icon: 'bell',
    column: {
      type: 'notifications',
      subtype: '',
    },
    paramList: ['all'],
  },
  {
    name: 'Organization',
    icon: 'organization',
    column: {
      type: 'activity',
      subtype: 'ORG_PUBLIC_EVENTS',
    },
    paramList: ['org'],
  },
  {
    name: 'Repository',
    icon: 'repo',
    column: {
      type: 'activity',
      subtype: 'REPO_EVENTS',
    },
    paramList: ['owner', 'repo'],
  },
]

const connectToStore = connect(
  (state: any) => ({
    currentOpenedModal: selectors.currentOpenedModal(state),
  }),
  {
    pushModal: actions.pushModal,
  },
)

class AddColumnModalComponent extends PureComponent<
  ExtractPropsFromConnector<typeof connectToStore>
> {
  state = {
    availableWidth: 0,
  }

  handleLayout: ViewProps['onLayout'] = e => {
    this.setState({ availableWidth: e.nativeEvent.layout.width })
  }

  keyExtractor(columnType: ColumnType) {
    return `add-column-button-${columnType.column.type}-${columnType.column
      .subtype || ''}`
  }

  renderItem: FlatListProps<ColumnType>['renderItem'] = ({ item }) => (
    <ThemeConsumer key={this.keyExtractor(item)}>
      {({ theme }) => (
        <TouchableOpacity
          onPress={() =>
            this.props.pushModal({
              name: 'ADD_COLUMN_DETAILS',
              params: item,
            })
          }
          style={{
            width:
              this.state.availableWidth /
              Math.floor(this.state.availableWidth / (82 + contentPadding)),
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: contentPadding / 4,
              marginBottom: contentPadding,
              paddingVertical: contentPadding / 2,
            }}
          >
            <ColumnHeaderItem
              iconName={item.icon}
              iconStyle={{ fontSize: 24, marginBottom: contentPadding / 2 }}
            />

            <Text style={{ color: theme.foregroundColor }}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    </ThemeConsumer>
  )

  renderColumnType = (item: ColumnType, index: number) =>
    this.renderItem({ item, index })

  render() {
    return (
      <ModalColumn iconName="plus" title="Add Column">
        <View
          style={{
            flex: 1,
            padding: (3 / 4) * contentPadding,
          }}
        >
          <View
            onLayout={this.handleLayout}
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignContent: 'flex-start',
            }}
          >
            {!!this.state.availableWidth &&
              columnTypes.map(this.renderColumnType)}
          </View>
        </View>
      </ModalColumn>
    )
  }
}

export const AddColumnModal = connectToStore(AddColumnModalComponent)

hoistNonReactStatics(AddColumnModal, AddColumnModalComponent as any)
