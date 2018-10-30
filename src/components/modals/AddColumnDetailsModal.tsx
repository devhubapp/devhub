import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import {
  Button,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { ExtractPropsFromConnector, GitHubIcon } from '../../types'
import { ModalColumn } from '../columns/ModalColumn'

import { contentPadding } from '../../styles/variables'
import { guid } from '../../utils/helpers/shared'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { ThemeConsumer } from '../context/ThemeContext'

interface ColumnType {
  name: string
  icon: GitHubIcon
}

const connectToStore = connect(
  (state: any) => ({
    currentOpenedModal: selectors.currentOpenedModal(state),
  }),
  {
    addColumn: actions.addColumn,
  },
)

class AddColumnDetailsModalComponent extends PureComponent<
  ExtractPropsFromConnector<typeof connectToStore>
> {
  state = {
    username: '',
  }

  handleCreateColumn = () => {
    const { username } = this.state

    if (!username) {
      alert('Usename cannot be empty.')
      return
    }

    // TODO: Make it dynamic
    this.props.addColumn({
      id: guid(),
      type: 'activity',
      subtype: 'USER_RECEIVED_EVENTS',
      params: {
        username,
      },
    })
  }

  handleUsernameChange: TextInputProps['onChange'] = (e: any) =>
    this.setState({ username: e.target.value })

  render() {
    const { username } = this.state

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ModalColumn iconName="plus" title="Add Column">
            <View style={{ flex: 1, padding: contentPadding }}>
              <TextInput
                onChange={this.handleUsernameChange}
                placeholder="GitHub Username (e.g. brunolemos)"
                style={{ color: theme.foregroundColor }}
                value={username}
              />
              <Button onPress={this.handleCreateColumn} title="Create Column" />
            </View>
          </ModalColumn>
        )}
      </ThemeConsumer>
    )
  }
}

export const AddColumnDetailsModal = connectToStore(
  AddColumnDetailsModalComponent,
)

hoistNonReactStatics(
  AddColumnDetailsModal,
  AddColumnDetailsModalComponent as any,
)
